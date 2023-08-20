import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { product_name, product_description, price, quantity, image } = body;
    const newProduct = await prismadb.products.create({
      data: {
        product_name,
        product_description,
        price,
        quantity,
        image,
      },
    });
    return NextResponse.json(newProduct);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
