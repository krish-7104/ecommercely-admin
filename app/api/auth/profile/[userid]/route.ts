import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: { userid: string } }
) {
  try {
    const user = await prismadb.adminUser.findUnique({
      where: { id: context.params.userid },
    });
    if (user) {
      return NextResponse.json(
        {
          message: "Admin Found!",
          user,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "Admin Not Found!",
        },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Internal Error",
      },
      { status: 500 }
    );
  }
}
