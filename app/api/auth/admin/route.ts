import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
  try {
    const admins = await prismadb.adminUser.findMany({
      select: {
        email: true,
        name: true,
        id: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(admins);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as {
      email: string;
      password: string;
      name: string;
      active?: boolean;
    };
    const { email, password, name } = body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prismadb.adminUser.create({
      data: {
        email,
        password: hashedPassword,
        name,
        active: body.active ?? true,
      },
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
