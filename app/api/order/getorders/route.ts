import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const order = await prismadb.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: true },
    });
    return NextResponse.json(order);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
