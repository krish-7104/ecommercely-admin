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

    const changesTodayProduct = products.filter(
      (item) =>
        item?.createdAt &&
        differenceInDays(today, startOfDay(new Date(item.createdAt))) === 0
    ).length;

    const changesYesterdayProduct = products.filter(
      (item) =>
        item?.createdAt &&
        differenceInDays(yesterday, startOfDay(new Date(item.createdAt))) === 0
    ).length;

    const changesTodayStock = products.reduce(
      (sum, product) =>
        product.createdAt &&
        differenceInDays(today, startOfDay(new Date(product.createdAt))) === 0
          ? sum + product.quantity
          : sum,
      0
    );

    const changesYesterdayStock = products.reduce(
      (sum, product) =>
        product.createdAt &&
        differenceInDays(yesterday, startOfDay(new Date(product.createdAt))) ===
          0
          ? sum + product.quantity
          : sum,
      0
    );

    const percentageIncreaseProduct =
      changesYesterdayProduct !== 0
        ? ((changesTodayProduct - changesYesterdayProduct) /
            changesYesterdayProduct) *
          100
        : changesTodayProduct * 100;

    const percentageIncreaseStock =
      changesYesterdayStock !== 0
        ? ((changesTodayStock - changesYesterdayStock) /
            changesYesterdayStock) *
          100
        : changesTodayStock * 100;

    const responseData = {
      products,
      totalQuantity,
      totalProducts,
      changesTodayProduct,
      changesYesterdayProduct,
      percentageIncreaseProduct,
      changesTodayStock,
      changesYesterdayStock,
      percentageIncreaseStock,
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
