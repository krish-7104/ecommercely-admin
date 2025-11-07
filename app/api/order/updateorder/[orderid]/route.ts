import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function PUT(
  req: Request,
  context: { params: { orderid: string } }
) {
  
  try {
    const body = await req.json() as Prisma.OrderUpdateInput;
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
