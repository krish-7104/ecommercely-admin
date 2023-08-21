import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    await prismadb.product.update({
      where: { id: body.id },
      data: {
        ...body,
      },
    });
    return new NextResponse("Product Updated", { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
