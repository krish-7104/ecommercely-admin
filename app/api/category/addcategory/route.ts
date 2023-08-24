import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name } = body;
    const category = await prismadb.category.findUnique({ where: { name } });
    if (!category) {
      const newCategory = await prismadb.category.create({
        data: {
          name,
        },
      });
      return NextResponse.json(newCategory);
    } else {
      return new NextResponse("Category Already Exists", { status: 403 });
    }
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
