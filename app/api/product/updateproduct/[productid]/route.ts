import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  context: { params: { productid: string } }
) {
  console.log(req.url);
  try {
    const data = await req.json();
    const product = await prismadb.product.update({
      where: { id: context.params.productid },
      data: data,
    });

    if (product) {
      return new NextResponse("Product Updated", { status: 200 });
    } else {
      return new NextResponse("Product not found", { status: 404 });
    }
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
