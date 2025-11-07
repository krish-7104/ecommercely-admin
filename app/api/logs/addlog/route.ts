import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    
    const body = await req.json() as Prisma.LogsCreateInput;
    const newLog = await prismadb.logs.create({ data: body });
    return new NextResponse("Log Added", { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
