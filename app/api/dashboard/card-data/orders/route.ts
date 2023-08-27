import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { differenceInDays, subDays, startOfDay } from "date-fns";

export async function GET(req: Request) {
  try {
    const orders = await prismadb.order.findMany();
    const totalOrders = orders.length;
    const totalProfit = orders.reduce(
      (sum: number, item: any) => sum + item.total,
      0
    );

    const today = startOfDay(new Date());
    const yesterday = subDays(today, 1);

    const changesTodayOrder = orders.filter(
      (item) =>
        differenceInDays(today, startOfDay(new Date(item.createdAt))) === 0
    ).length;

    const changesYesterdayOrder = orders.filter(
      (item) =>
        differenceInDays(yesterday, startOfDay(new Date(item.createdAt))) === 0
    ).length;

    const percentageIncreaseOrder =
      changesYesterdayOrder !== 0
        ? ((changesTodayOrder - changesYesterdayOrder) /
            changesYesterdayOrder) *
          100
        : changesTodayOrder * 100;

    const changesTodayProfit = orders
      .filter(
        (item) =>
          differenceInDays(today, startOfDay(new Date(item.createdAt))) === 0
      )
      .reduce((sum, item) => sum + item.total, 0);

    const changesYesterdayProfit = orders
      .filter(
        (item) =>
          differenceInDays(yesterday, startOfDay(new Date(item.createdAt))) ===
          0
      )
      .reduce((sum, item) => sum + item.total, 0);

    const percentageIncreaseProfit =
      changesYesterdayProfit !== 0
        ? ((changesTodayProfit - changesYesterdayProfit) /
            changesYesterdayProfit) *
          100
        : changesTodayProfit * 100;

    const responseData = {
      totalOrders,
      totalProfit,
      changesTodayOrder,
      changesYesterdayOrder,
      percentageIncreaseOrder,
      changesTodayProfit,
      changesYesterdayProfit,
      percentageIncreaseProfit,
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
