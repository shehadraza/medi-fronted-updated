
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

const ACCESS_COOKIE = "medi_access";
const REFRESH_COOKIE = "medi_refresh";

type TokenPair = {
  access_token: string;
  refresh_token: string;
};

type Method = "GET" | "POST" | "PATCH" | "DELETE";

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
  body?: unknown,
  search = "",
) {
  const endpointPath = endpoint ? `/${endpoint}` : "";

  return fetch(`${API_URL}/admin${endpointPath}${search}`, {
    method,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...(body !== undefined
        ? { "Content-Type": "application/json" }
        : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    cache: "no-store",
  });
}

async function handleRequest(
  request: NextRequest,
  context: RouteContext,
  method: Method,
) {
  try {
    if (!API_URL) {
      return NextResponse.json(
        { detail: "Admin API is not configured." },
        { status: 500 },
      );
    }

    const { path = [] } = await context.params;

    if (
      path.length === 0 ||
      path.some((segment) => !/^[a-zA-Z0-9_-]+$/.test(segment))
    ) {
      return NextResponse.json(
        { detail: "Admin endpoint not found." },
        { status: 404 },
      );
    }

    const endpoint = path.join("/");

    const cookieStore = await cookies();

    let accessToken = cookieStore.get(ACCESS_COOKIE)?.value;
    const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

    if (!accessToken) {
      return NextResponse.json(
        { detail: "Authentication required." },
        { status: 401 },
      );
    }

    let body: unknown = undefined;

if (method === "POST" || method === "PATCH") {
  const rawBody = await request.text();

  if (rawBody.trim()) {
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { detail: "Invalid request body." },
        { status: 400 },
      );
    }
  }
}

    const search = method === "GET" ? request.nextUrl.search : "";

    let upstream = await backendRequest(
      endpoint,
      method,
      accessToken,
      body,
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
          body,
          search,
        );

        data = await readResponse(upstream);
      }
    }

    const response =
      upstream.status === 204
        ? new NextResponse(null, { status: 204 })
        : NextResponse.json(data, { status: upstream.status });

    if (refreshedTokens) {
      setCookies(response, refreshedTokens);
    } else if (upstream.status === 401) {
      clearCookies(response);
    }

    return response;
  } catch {
    return NextResponse.json(
      { detail: "Unable to connect to the Admin server." },
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

export async function PATCH(request: NextRequest, context: RouteContext) {
  return handleRequest(request, context, "PATCH");
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return handleRequest(request, context, "DELETE");
}
