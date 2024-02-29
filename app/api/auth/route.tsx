import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import connectToMongoDB from "@/lib/connectToMongo";
import History from "@/model/History";

export const POST = async (req: NextRequest) => {
  try {
    await connectToMongoDB();
    const body = await req.json();
    const { username, password } = body;
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: { username, password: hashed },
    });

    if (!newUser)
      return new NextResponse(
        JSON.stringify({
          error: "Failed sign up process",
          details: "Server issue or data is not valid",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );

    const newUserHistory = await History.create({ username, history: [] });

    if (newUserHistory) {
      return new NextResponse(JSON.stringify(username, null, 2), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error: "Server issue",
        details: "Server issue or data is not valid",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
