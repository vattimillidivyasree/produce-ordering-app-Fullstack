import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("govigi_token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const protectedRoutes = ["/products", "/place-order", "/orders"];

  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/products", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/products", "/place-order", "/orders"],
};
