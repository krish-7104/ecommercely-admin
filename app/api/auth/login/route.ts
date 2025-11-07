import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import prismadb from "@/lib/prismadb";
var bcrypt = require("bcryptjs");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const user = await prismadb.adminUser.findUnique({
      where: { email },
    });

    if (!user) {
      return new NextResponse("Invalid credentials", { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return new NextResponse("Invalid Credentials", { status: 401 });
    }

    const secret = new TextEncoder().encode(
      process.env.SECRET_KEY!
    );

    const token = await new SignJWT({
      userId: user.id,
      name: user.name,
      email: email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret);

    const response = new NextResponse(
      JSON.stringify({ message: "Successfully logged in", token })
    );
    return response;
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
