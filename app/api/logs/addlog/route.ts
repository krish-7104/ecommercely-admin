import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    console.log(req.url);
    const body = await req.json();
    const newLog = await prismadb.logs.create({ data: body });
    return new NextResponse("Log Added", { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
