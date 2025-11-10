import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
var bcrypt = require("bcryptjs");

interface RegisterBody {
  email: string;
  password: string;
  name: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RegisterBody;
    const { email, password, name } = body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prismadb.adminUser.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
