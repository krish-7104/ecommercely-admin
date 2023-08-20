import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = body;
    const newUser = await prismadb.adminUser.create({
      data: {
        email,
        password,
        name,
      },
    });
    return NextResponse.json(newUser);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
