import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    console.log(req.url);
    const userData = await prismadb.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phoneno: true,
        address: true,
        pincode: true,
        state: true,
        city: true,
        country: true,
        createdAt: true,
        updatedAt: true,
        carts: true,
        orders: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(userData);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
