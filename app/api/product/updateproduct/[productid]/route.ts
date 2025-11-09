import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function PUT(
  req: Request,
  context: { params: { productid: string } }
) {
  
  try {
    const beforeData = await prismadb.product.findUnique({
      where: { id: context.params.productid },
      include: {
        Category: true,
      },
    });

    if (!beforeData) {
      return new NextResponse("Product not found", { status: 404 });
    }

    const data = await req.json() as Prisma.ProductUpdateInput;
    const afterData = await prismadb.product.update({
      where: { id: context.params.productid },
      data: data,
      include: {
        Category: true,
      },
    });

    return NextResponse.json({
      message: "Product Updated",
      before: beforeData,
      after: afterData,
    });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
