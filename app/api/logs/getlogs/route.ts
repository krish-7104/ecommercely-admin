import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
export async function GET(req: Request) {
  try {
    const logs = await prismadb.logs.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(logs);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
