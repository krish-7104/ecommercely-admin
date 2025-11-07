import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

interface UserBody {
  data: {
    token: string;
  };
}

export async function POST(req: Request) {
  const body = await req.json() as UserBody;
  const { token } = body.data;
  console.log(token);
  if (!token) {
    return new NextResponse("Unauthorized User", { status: 401 });
  }
  try {
    const data = verify(token, process.env.SECRET_KEY || "");
    const response = new NextResponse(
      JSON.stringify({
        message: "Verified User",
        user: data,
      })
    );
    return response;
  } catch (error) {
    if (error instanceof Error && error.message === "jwt expired") {
      return new NextResponse("Session Expired", { status: 401 });
    } else {
      console.log(error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }
}
