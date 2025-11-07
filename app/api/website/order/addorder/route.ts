import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json() as Prisma.OrderCreateInput;
    const data = await prismadb.order.create({
      data: body,
    });
    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
