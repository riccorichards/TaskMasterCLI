import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { username, password } = body;
    const user = await prisma.user.findUnique({ where: { username } }); 

    if (!user)
      return new NextResponse(
        JSON.stringify({
          error: "Wrong credentials",
          details: "Username or password is incorrect",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword)
      return new NextResponse(
        JSON.stringify({
          error: "Wrong credentials",
          details: "Username or password is incorrect",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );

    return new Response(JSON.stringify(username), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error); // Make sure to log the error
    return new NextResponse(
      JSON.stringify({
        error: "Server issue",
        details: "Unexpected error occurred",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
