import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: { username: string } }
) => {
  try {
    const { period } = await req.json();
    const { username } = params;
    const newPeriod = await prisma.timeStats.create({
      data: { endTime: period, sumTimeHrs: 0, spendMsInTasks: [], username },
    });

    if (!newPeriod) {
      return new NextResponse(
        JSON.stringify({
          error: "Error while adding new period",
          details: `Data is not available or server issue.`,
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(
      JSON.stringify(`Your micro goal will be finished at: ${period}`),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
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
