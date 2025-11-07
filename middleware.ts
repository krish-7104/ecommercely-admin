import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/website")) {
    const origin = request.headers.get("origin");
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001",
    ];
    
    const isDevelopment = process.env.NODE_ENV === "development";
    
    if (request.method === "OPTIONS") {
      const response = new NextResponse(null, { status: 200 });
      
      if (origin && (allowedOrigins.includes(origin) || isDevelopment)) {
        response.headers.set("Access-Control-Allow-Origin", origin);
      }
      response.headers.set("Access-Control-Allow-Credentials", "true");
      response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie");
      
      return response;
    }
    
    const response = NextResponse.next();
    
    if (origin && (allowedOrigins.includes(origin) || isDevelopment)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
    }
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie");
    response.headers.set("Access-Control-Expose-Headers", "Set-Cookie");
    
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: "/api/website/:path*",
};

