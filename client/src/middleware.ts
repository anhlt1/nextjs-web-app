import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePaths = ["/me"];
const authPaths = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("sessionToken");
  // if user does not login and access private paths, redirect to login page
  if (!sessionToken && privatePaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // if user already login and access login, register paths, redirect to home page
  if (sessionToken && authPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/me", request.url));
  }

  return NextResponse.next(); // tiếp tục chuyển tiếp request
}

// config các route áp dụng middleware
export const config = {
  matcher: ["/me", "/login", "/register"],
};
