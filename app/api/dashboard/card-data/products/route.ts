import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { differenceInDays, subDays, startOfDay } from "date-fns";

export async function GET(req: Request) {
  try {
    const products = await prismadb.product.findMany();
    const totalProducts = products.length;
    const totalQuantity = products.reduce(
      (sum, product) => sum + product.quantity,
      0
    );

    const today = startOfDay(new Date());
    const yesterday = subDays(today, 1);

    const changesToday = products.filter(
      (item) =>
        differenceInDays(
          today,
          startOfDay(
            new Date(
              item.createdAt.toLocaleString("en-US", {
                timeZone: "Asia/Kolkata",
                day: "numeric",
                month: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: true,
              })
            )
          )
        ) === 0
    ).length;

    const changesYesterday = products.filter(
      (item) =>
        differenceInDays(
          yesterday,
          startOfDay(
            new Date(
              item.createdAt.toLocaleString("en-US", {
                timeZone: "Asia/Kolkata",
                day: "numeric",
                month: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: true,
              })
            )
          )
        ) === 0
    ).length;

    const percentageIncrease =
      changesToday === 0
        ? 0
        : changesYesterday !== 0
        ? ((changesToday - changesYesterday) / changesYesterday) * 100
        : changesToday * 100;

    const responseData = {
      totalQuantity,
      totalProducts,
      changesToday,
      changesYesterday,
      percentageIncrease,
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
