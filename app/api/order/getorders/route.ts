import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    console.log(req.url);
    const order = await prismadb.order.findMany({
      orderBy: { createdAt: "desc" },
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
    return NextResponse.json(order);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
