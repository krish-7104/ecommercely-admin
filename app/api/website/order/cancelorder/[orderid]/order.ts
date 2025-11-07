import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

interface CancelOrderBody {
  body: Prisma.OrderUpdateInput;
}

export async function POST(
  req: Request,
  context: { params: { orderid: string } }
) {
  try {
    const { body } = await req.json() as CancelOrderBody;
    const order = await prismadb.order.update({
      where: { id: context.params.orderid },
      data: body,
    });

    if (order) {
      return NextResponse.json(order);
    } else {
      return new NextResponse("Order not found", { status: 401 });
    }
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
