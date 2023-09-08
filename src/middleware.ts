import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  switch (url.pathname) {
    case "/auth":
      if (request.cookies.get("authenticated")?.value === "true") {
        url.pathname = "/map";
        return NextResponse.redirect(url);
      }
      break;
    case "/":
      url.pathname = "/auth";
      return NextResponse.redirect(url);
  }
}
