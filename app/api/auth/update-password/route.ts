import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
var bcrypt = require("bcryptjs");

interface UpdatePasswordBody {
  token: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as UpdatePasswordBody;
    const { token, password } = body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const resetTokenRecord = await prismadb.resetTokenAdmin.findFirst({
      where: {
        token: token,
        expiresAt: {
          gte: new Date(),
        },
      },
    });
    if (resetTokenRecord) {
      const userId = resetTokenRecord.userId;
      const user = await prismadb.adminUser.findUnique({
        where: { id: userId },
      });
      if (user) {
        const updatedUser = await prismadb.adminUser.update({
          where: { id: userId },
          data: { password: hashedPassword },
        });

        await prismadb.resetTokenAdmin.delete({
          where: { id: resetTokenRecord.id },
        });
      } else {
        return new NextResponse("User Not Found", { status: 404 });
      }

      return new NextResponse("Password Updated", { status: 200 });
    } else {
      return new NextResponse("Invalid or Expired Token", { status: 401 });
    }
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
