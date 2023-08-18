import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = body;
    const newUser = await prisma.adminUser.create({
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
