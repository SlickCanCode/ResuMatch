
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL!;

async function proxyRequest(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;

  const backendUrl = `${BACKEND_URL}/${path.join("/")}${request.nextUrl.search}`;

  const headers = new Headers();

  // Forward the browser's cookies to Spring Boot
  const cookie = request.headers.get("cookie");

  if (cookie) {
    headers.set("cookie", cookie);
  }

  // Forward content type
  const contentType = request.headers.get("content-type");

  if (contentType) {
    headers.set("content-type", contentType);
  }

  const body =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : await request.arrayBuffer();

  const backendResponse = await fetch(backendUrl, {
    method: request.method,
    headers,
    body,
    redirect: "manual",
  });


  const responseHeaders = new Headers();

  const location = backendResponse.headers.get("location");

  if (location) {
    responseHeaders.set("location", location);
  }
  // Forward normal response headers
  const responseContentType =
    backendResponse.headers.get("content-type");

  if (responseContentType) {
    responseHeaders.set("content-type", responseContentType);
  }

  // IMPORTANT:
  // Forward Set-Cookie headers from Spring Boot to the browser.
  const setCookies = backendResponse.headers.getSetCookie();

  for (const cookie of setCookies) {
    responseHeaders.append("set-cookie", cookie);
  }

  return new NextResponse(backendResponse.body, {
    status: backendResponse.status,
    headers: responseHeaders,
  });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;

