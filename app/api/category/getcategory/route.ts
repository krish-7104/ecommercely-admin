import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    console.log(req.url);
    const product = await prismadb.category.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
