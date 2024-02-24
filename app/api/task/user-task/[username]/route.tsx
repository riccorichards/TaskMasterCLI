import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { username: string } }
) => {
  try {
    const { username } = params;

    const tasks = await prisma.dailyTask.findMany({
      where: { username: username },
    });

    if (!tasks) {
      return new NextResponse(
        JSON.stringify({
          error: "Error fetching all tasks",
          details: `Data is not available or server issue.`,
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(JSON.stringify(tasks, null, 2), {
      status: 200,
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
