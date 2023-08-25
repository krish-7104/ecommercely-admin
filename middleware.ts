import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === "/login";
  const token = request.cookies.get("adminToken")?.value || "";

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/orders",
    "/orders/:orderid*",
    "/users",
    "/products",
    "/products/:productid*",
    "/products/addproduct",
    "/category",
    "/category/addcategory",
    "/admin",
    "/admin/addadmin",
    "/admin/:adminid*",
  ],
};
