import { NextResponse } from "next/server";

export function middleware(req) {
  // Access cookies correctly using the NextRequest API
  const authToken = req.cookies.get("auth_token");

  // Define page checks
  const isLoginPage = req.nextUrl.pathname === "/login";
  const isPublicPage = req.nextUrl.pathname.startsWith("/public");
  const isImageRequest = req.nextUrl.pathname.startsWith("/_next/image");

  // 🔹 Redirect authenticated users away from the login page

  if (authToken && authToken.value !== "" && isLoginPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 🔹 Redirect unauthenticated users trying to access protected routes
  if (
    (!authToken || authToken?.value === "") &&
    !isLoginPage &&
    !isPublicPage &&
    !isImageRequest
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// 🔹 Match protected routes
export const config = {
  matcher: [
    "/((?!api|_next/image|favicon.ico|sitemap.xml|robots.txt|_next/static).*)",
  ],
};
