import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prismadb from "@/lib/prismadb";
import { getCookieString } from "@/lib/cookie-helper";
var bcrypt = require("bcryptjs");

interface LoginBody {
  email: string;
  password: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as LoginBody;
    const { email, password } = body;

    const user = await prismadb.user.findUnique({
      where: { email },
    });

    if (!user) {
      return new NextResponse("Invalid credentials", { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return new NextResponse("Invalid credentials", { status: 401 });
    }

    const token = jwt.sign(
      { userId: user.id, name: user.name, email: user.email },
      process.env.SECRET_KEY || "",
      {
        expiresIn: "24h",
      }
    );

    const modifiedUser = { name: user.name, email: user.email, id: user.id };

    const response = new NextResponse(
      JSON.stringify({
        message: "Successfully logged in",
        user: { ...modifiedUser },
      })
    );

    response.headers.set("Set-Cookie", getCookieString("token", token));

    return response;
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
