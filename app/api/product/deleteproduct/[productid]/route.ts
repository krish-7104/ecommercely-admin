import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  context: { params: { productid: string } }
) {
  try {
    await prismadb.product.delete({
      where: { id: context.params.productid },
    });
    return new NextResponse("Product Deleted", { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
