import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newLog = await prismadb.category.create({ data: body });
    return NextResponse.json(newLog);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
