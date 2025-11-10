import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { before } from "node:test";

export async function GET(
  req: Request,
  context: { params: { userId: string } }
) {
  try {
    const { userId } = context.params;
    const user = await prismadb.adminUser.findUnique({
      where: { id: userId },
      select: {
        email: true,
        name: true,
        id: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return new NextResponse("User Not Found", { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  context: { params: { userId: string } }
) {
  try {
    const body = (await req.json()) as any;
    const { type, email, newPassword, name, active } = body;
    const { userId } = context.params;
    const beforeUpdateUser = await prismadb.adminUser.findUnique({
      where: { id: userId },
      select: {
        email: true,
        name: true,
        id: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!beforeUpdateUser) {
      return new NextResponse("User Not Found", { status: 404 });
    }
    switch (type) {
      case "update-password":
        updatePasswordHandler(newPassword, userId);
        return new NextResponse("Password Updated", { status: 200 });
      case "update-info":
        const dataToUpdate = {};
        if (email) {
          Object.assign(dataToUpdate, { email: email });
        }
        if (name) {
          Object.assign(dataToUpdate, { name: name });
        }
        if (active === true || active === false) {
          Object.assign(dataToUpdate, { active: active });
        }
        const updatedUser = await prismadb.adminUser.update({
          where: { id: userId },
          data: { ...dataToUpdate },
        });
        return NextResponse.json(
          {
            message: "User Info Updated",
            before: beforeUpdateUser,
            after: updatedUser,
          },
          { status: 200 }
        );

      default:
        break;
    }

    return new NextResponse("Invalid Type", { status: 404 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

const updatePasswordHandler = async (newPassword: string, userId: string) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const updatedUser = await prismadb.adminUser.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
  return updatedUser;
};

export async function DELETE(
  req: Request,
  context: { params: { userId: string } }
) {
  try {
    const { userId } = context.params;
    await prismadb.adminUser.delete({
      where: { id: userId },
    });
    return new NextResponse("User Deleted", { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
