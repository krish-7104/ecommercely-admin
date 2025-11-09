import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function PUT(
  req: Request,
  context: { params: { orderid: string } }
) {
  
  try {
    const beforeData = await prismadb.order.findUnique({
      where: { id: context.params.orderid },
      include: {
        user: true,
      },
    });

    if (!beforeData) {
      return new NextResponse("Order not found", { status: 404 });
    }

    const body = await req.json() as Prisma.OrderUpdateInput;
    const afterData = await prismadb.order.update({
      where: { id: context.params.orderid },
      data: { ...body },
      include: {
        user: true,
      },
    });

    return NextResponse.json({
      message: "Order Updated",
      before: beforeData,
      after: afterData,
    });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
