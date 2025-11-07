import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json() as Prisma.CartCreateInput;
    const data = await prismadb.cart.create({
      data: body,
    });
    return NextResponse.json({ id: data.id });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
