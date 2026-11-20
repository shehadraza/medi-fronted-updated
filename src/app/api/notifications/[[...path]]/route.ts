
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

const ACCESS_COOKIE = "medi_access";
const REFRESH_COOKIE = "medi_refresh";

type TokenPair = {
  access_token: string;
  refresh_token: string;
};

type Method = "GET" | "POST" | "PATCH";

type RouteContext = {
  params: Promise<{ path?: string[] }>;
};

async function readResponse(response: Response) {
  try {
    return await response.json();
  } catch {
    return { detail: "Invalid response from server." };
  }
}

function readTokens(data: any): TokenPair | null {
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

function setCookies(response: NextResponse, tokens: TokenPair) {
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

function clearCookies(response: NextResponse) {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/api",
    maxAge: 0,
  };

  response.cookies.set(ACCESS_COOKIE, "", options);
  response.cookies.set(REFRESH_COOKIE, "", options);
}

async function refreshSession(refreshToken: string) {
  if (!API_URL) return null;

  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
    cache: "no-store",
  });

  if (!response.ok) return null;

  return readTokens(await readResponse(response));
}

async function backendRequest(
  endpoint: string,
  method: Method,
  token: string,
  search = "",
) {
  const endpointPath = endpoint ? `/${endpoint}` : "";

  return fetch(
    `${API_URL}/notifications${endpointPath}${search}`,
    {
      method,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );
}

async function handleRequest(
  request: NextRequest,
  context: RouteContext,
  method: Method,
) {
  try {
    if (!API_URL) {
      return NextResponse.json(
        { detail: "Notification API is not configured." },
        { status: 500 },
      );
    }

    const { path = [] } = await context.params;

    let endpoint = "";

    // Main notification inbox: GET /api/notifications
    if (path.length === 0 && method === "GET") {
      endpoint = "";
    } else if (
      path.length === 1 &&
      path[0] === "unread-count" &&
      method === "GET"
    ) {
      endpoint = "unread-count";
    } else if (
      path.length === 1 &&
      path[0] === "read-all" &&
      method === "POST"
    ) {
      endpoint = "read-all";
    } else if (
      path.length === 1 &&
      method === "GET"
    ) {
      endpoint = path[0];
    } else if (
      path.length === 2 &&
      path[1] === "read" &&
      method === "PATCH"
    ) {
      const notificationId = path[0];

      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

      if (!uuidRegex.test(notificationId)) {
        return NextResponse.json(
          { detail: "Invalid notification ID." },
          { status: 400 },
        );
      }

      endpoint = `${notificationId}/read`;
    } else {
      return NextResponse.json(
        { detail: "Notification endpoint not found." },
        { status: 404 },
      );
    }

    const cookieStore = await cookies();

    let accessToken = cookieStore.get(ACCESS_COOKIE)?.value;
    const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

    if (!accessToken) {
      return NextResponse.json(
        { detail: "Authentication required." },
        { status: 401 },
      );
    }

    // Forward query parameters for GET requests.
    const search = method === "GET"
      ? request.nextUrl.search
      : "";

    let upstream = await backendRequest(
      endpoint,
      method,
      accessToken,
      search,
    );

    let data = await readResponse(upstream);
    let refreshedTokens: TokenPair | null = null;

    if (upstream.status === 401 && refreshToken) {
      refreshedTokens = await refreshSession(refreshToken);

      if (refreshedTokens) {
        accessToken = refreshedTokens.access_token;

        upstream = await backendRequest(
          endpoint,
          method,
          accessToken,
          search,
        );

        data = await readResponse(upstream);
      }
    }

    const response = NextResponse.json(data, {
      status: upstream.status,
    });

    if (refreshedTokens) {
      setCookies(response, refreshedTokens);
    } else if (upstream.status === 401) {
      clearCookies(response);
    }

    return response;
  } catch {
    return NextResponse.json(
      { detail: "Unable to connect to the notification server." },
      { status: 502 },
    );
  }
}

export async function GET(
  request: NextRequest,
  context: RouteContext,
) {
  return handleRequest(request, context, "GET");
}

export async function POST(
  request: NextRequest,
  context: RouteContext,
) {
  return handleRequest(request, context, "POST");
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext,
) {
  return handleRequest(request, context, "PATCH");
}
