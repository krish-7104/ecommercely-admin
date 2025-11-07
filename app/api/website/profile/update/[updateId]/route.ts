import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { Prisma } from "@prisma/client";

export async function PUT(
  req: Request,
  context: { params: { updateId: string } }
) {
  try {
    const body = await req.json() as Prisma.UserUpdateInput;
    await prismadb.user.update({
      where: { id: context.params.updateId },
      data: body,
    });
    return new NextResponse(
      JSON.stringify({
        message: "Successfully Updated",
      })
    );
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
