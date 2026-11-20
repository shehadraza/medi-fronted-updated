
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

const ACCESS_COOKIE = "medi_access";
const REFRESH_COOKIE = "medi_refresh";

type TokenPair = {
  access_token: string;
  refresh_token: string;
};

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

function getTokenPair(data: any): TokenPair | null {
  const tokens = data?.tokens;

  if (
    typeof tokens?.access_token !== "string" ||
    typeof tokens?.refresh_token !== "string"
  ) {
    return null;
  }

  return {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
  };
}



function setAuthCookies(response: NextResponse, tokens: TokenPair) {
  const secure = process.env.NODE_ENV === "production";

  response.cookies.set(ACCESS_COOKIE, tokens.access_token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/api",
    maxAge: 30 * 60,
  });

  response.cookies.set(REFRESH_COOKIE, tokens.refresh_token, {
  httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/api",
    maxAge: 7 * 24 * 60 * 60,
  });
}

function clearAuthCookies(response: NextResponse) {
  response.cookies.set(ACCESS_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api",
    maxAge: 0,
  });

  response.cookies.set(REFRESH_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api",
    maxAge: 0,
  });
}

async function readResponse(response: Response) {
  try {
    return await response.json();
  } catch {
    return { detail: "Invalid response from authentication server." };
  }
}

async function backendRequest(
  path: string,
  method: string,
  body?: unknown,
  accessToken?: string,
) {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return fetch(`${API_URL}/auth/${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
}

async function refreshSession(refreshToken: string) {
  const response = await backendRequest(
    "refresh",
    "POST",
    { refresh_token: refreshToken },
  );

  const data = await readResponse(response);

  if (!response.ok) {
    return { ok: false as const };
  }

  const tokens = getTokenPair(data);

  if (!tokens) {
    return { ok: false as const };
  }

  return { ok: true as const, tokens };
}

function safeAuthResponse(data: any) {
  const { tokens: _tokens, ...safeData } = data ?? {};
  return safeData;
}

async function handleRequest(
  request: NextRequest,
  context: RouteContext,
  method: "GET" | "POST",
) {
  try {
    const { path } = await context.params;

    if (!API_URL) {
      return NextResponse.json(
        { detail: "Authentication API is not configured." },
        { status: 500 },
      );
    }

    if (!Array.isArray(path) || path.length !== 1) {
      return NextResponse.json(
        { detail: "Invalid authentication route." },
        { status: 404 },
      );
    }

    const endpoint = path[0];

    const allowedEndpoints = [
      "register",
      "login",
      "me",
      "logout",
      "refresh",
      "forgot-password",
      "reset-password",
            "verify-email",
      "resend-verification",
    ];

    if (!allowedEndpoints.includes(endpoint)) {
      return NextResponse.json(
        { detail: "Authentication endpoint not found." },
        { status: 404 },
      );
    }

    if (
      (endpoint === "me" && method !== "GET") ||
      (endpoint !== "me" && method !== "POST")
    ) {
      return NextResponse.json(
        { detail: "Method not allowed." },
        { status: 405 },
      );
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;
    const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

    // Login and registration
    if (endpoint === "login") {
      const body = await request.json();

      const upstream = await backendRequest(endpoint, "POST", body);
      const data = await readResponse(upstream);

      if (!upstream.ok) {
        return NextResponse.json(data, { status: upstream.status });
      }

      const tokens = getTokenPair(data);

      if (!tokens) {
        return NextResponse.json(
          { detail: "Authentication server did not return valid tokens." },
          { status: 502 },
        );
      }

      const response = NextResponse.json(safeAuthResponse(data), {
        status: upstream.status,
      });

      setAuthCookies(response, tokens);
      return response;
    }

    // Current user
    if (endpoint === "me") {
      if (!accessToken) {
        return NextResponse.json(
          { detail: "Authentication required." },
          { status: 401 },
        );
      }

      let upstream = await backendRequest(
        "me",
        "GET",
        undefined,
        accessToken,
      );

      let data = await readResponse(upstream);
      let refreshedTokens: TokenPair | null = null;

      if (upstream.status === 401 && refreshToken) {
        const refreshed = await refreshSession(refreshToken);

        if (refreshed.ok) {
          refreshedTokens = refreshed.tokens;

          upstream = await backendRequest(
            "me",
            "GET",
            undefined,
            refreshed.tokens.access_token,
          );

          data = await readResponse(upstream);
        }
      }

      const response = NextResponse.json(data, {
        status: upstream.status,
      });

      if (refreshedTokens) {
        setAuthCookies(response, refreshedTokens);
      } else if (upstream.status === 401) {
        clearAuthCookies(response);
      }

      return response;
    }

    // Logout
    if (endpoint === "logout") {
      let tokenToRevoke = accessToken;

      if (!tokenToRevoke && refreshToken) {
        const refreshed = await refreshSession(refreshToken);

        if (refreshed.ok) {
          tokenToRevoke = refreshed.tokens.access_token;
        }
      }

      let data = { message: "Logged out successfully." };

      if (tokenToRevoke) {
        const upstream = await backendRequest(
          "logout",
          "POST",
          undefined,
          tokenToRevoke,
        );

        data = await readResponse(upstream);
      }

      const response = NextResponse.json(data);
      clearAuthCookies(response);
      return response;
    }

    // Refresh session
    if (endpoint === "refresh") {
      if (!refreshToken) {
        const response = NextResponse.json(
          { detail: "Refresh session not found." },
          { status: 401 },
        );

        clearAuthCookies(response);
        return response;
      }

      const refreshed = await refreshSession(refreshToken);

      if (!refreshed.ok) {
        const response = NextResponse.json(
          { detail: "Session expired. Please sign in again." },
          { status: 401 },
        );

        clearAuthCookies(response);
        return response;
      }

      const response = NextResponse.json({
        message: "Session refreshed successfully.",
      });

      setAuthCookies(response, refreshed.tokens);
      return response;
    }

    // Forgot password and reset password
    const body = await request.json();

    const upstream = await backendRequest(endpoint, "POST", body);
    const data = await readResponse(upstream);

    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json(
      { detail: "Unable to connect to the authentication server." },
      { status: 502 },
    );
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  return handleRequest(request, context, "GET");
}

export async function POST(request: NextRequest, context: RouteContext) {
  return handleRequest(request, context, "POST");
}
