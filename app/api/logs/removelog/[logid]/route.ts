import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  context: { params: { logid: string } }
) {
  try {
    
    await prismadb.logs.delete({
      where: { id: context.params.logid },
    });
    return new NextResponse("Log Deleted", { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
