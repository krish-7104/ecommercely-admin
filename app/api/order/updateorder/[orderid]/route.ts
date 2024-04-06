import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  context: { params: { orderid: string } }
) {
  console.log(req.url);
  try {
    const body = await req.json();
    const order = await prismadb.order.update({
      where: { id: context.params.orderid },
      data: { ...body },
    });
    if (order) {
      return new NextResponse("Order Updated", { status: 200 });
    } else {
      return new NextResponse("Order not found", { status: 404 });
    }
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
