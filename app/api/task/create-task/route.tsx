import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { title, desc } = body;

    const newTast = await prisma.dailyTask.create({
      data: { title, desc, spendMs: 0 },
    });

    if (!newTast)
      return new NextResponse(
        JSON.stringify({
          error: "Failed to add new task",
          details: "Invalid data or server issue",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );

    return new NextResponse(JSON.stringify(newTast, null, 2), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error: "Failed to create task",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
