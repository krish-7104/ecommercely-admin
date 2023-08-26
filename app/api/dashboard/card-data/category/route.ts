import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
// import { differenceInDays, subDays, startOfDay } from "date-fns";

export async function GET(req: Request) {
  try {
    const category = await prismadb.category.findMany();
    const totalCategory = category.length;

    const responseData = {
      totalCategory,
    };
    return new NextResponse(JSON.stringify(responseData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
