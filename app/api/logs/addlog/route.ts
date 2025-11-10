import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

const keysToIgnore = ["id", "createdAt", "updatedAt", "password"];

function getChangedFields(
  before: any,
  after: any
): { before: any; after: any } | null {
  if (!before && !after) return null;

  if (!before && after) {
    const filteredAfter: any = {};
    Object.keys(after).forEach((key) => {
      if (!keysToIgnore.includes(key)) {
        filteredAfter[key] = after[key];
      }
    });
    return { before: null, after: filteredAfter };
  }

  if (before && !after) {
    const filteredBefore: any = {};
    Object.keys(before).forEach((key) => {
      if (!keysToIgnore.includes(key)) {
        filteredBefore[key] = before[key];
      }
    });
    return { before: filteredBefore, after: null };
  }

  const changedBefore: any = {};
  const changedAfter: any = {};
  const allKeys = new Set([
    ...Object.keys(before || {}),
    ...Object.keys(after || {}),
  ]);

  allKeys.forEach((key) => {
    if (keysToIgnore.includes(key)) {
      return;
    }

    const beforeValue = before?.[key];
    const afterValue = after?.[key];

    if (JSON.stringify(beforeValue) !== JSON.stringify(afterValue)) {
      changedBefore[key] = beforeValue;
      changedAfter[key] = afterValue;
    }
  });

  if (
    Object.keys(changedBefore).length === 0 &&
    Object.keys(changedAfter).length === 0
  ) {
    return null;
  }

  return { before: changedBefore, after: changedAfter };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { before, after, ...rest } = body;

    const changedFields = getChangedFields(before, after);

    const logData: Prisma.LogsCreateInput = {
      ...rest,
      before:
        changedFields?.before !== undefined
          ? changedFields.before
          : Prisma.JsonNull,
      after:
        changedFields?.after !== undefined
          ? changedFields.after
          : Prisma.JsonNull,
    };

    const newLog = await prismadb.logs.create({ data: logData });
    return new NextResponse("Log Added", { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
