import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: { orderid: string } }
) {
  try {
    console.log(req.url);
    const order = await prismadb.order.findUnique({
      where: { id: context.params.orderid },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            address: true,
            phoneno: true,
            state: true,
            city: true,
            country: true,
            pincode: true,
          },
        },
      },
    });
    if (order) {
      return NextResponse.json(order);
    } else {
      return new NextResponse("Order not found", { status: 404 });
    }
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
