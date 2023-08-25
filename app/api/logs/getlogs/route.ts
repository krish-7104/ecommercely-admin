import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const logs = await prismadb.logs.findMany({});
    return NextResponse.json(logs);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
