import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";

export async function GET(req: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get("adminToken");

  if (!token) {
    return new NextResponse("Unauthorized User", { status: 401 });
  }
  try {
    const data = verify(token.value, process.env.SECRET_KEY || "");
    const response = new NextResponse(
      JSON.stringify({
        message: "Verified User",
        user: data,
      })
    );
    return response;
  } catch (error: any) {
    cookieStore.delete("adminToken");
    if (error.message === "jwt expired") {
      return new NextResponse("Session Expired", { status: 401 });
    } else {
      return new NextResponse("Internal Error", { status: 500 });
    }
  }
}
