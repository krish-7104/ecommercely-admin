import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  
  try {
    const body = await req.json() as Prisma.ProductCreateInput;
    const {
      product_name,
      product_description,
      price,
      quantity,
      image,
      category,
    } = body;
    const newProduct = await prismadb.product.create({
      data: {
        product_name,
        product_description,
        price,
        quantity,
        image,
        category,
      },
    });
    return NextResponse.json(newProduct);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
