import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (req: NextRequest) => {
  try {
    const { sumTimeHrs, timeStatsID } = await req.json();

    const updatedTimeManagement = await prisma.timeStats.update({
      where: { id: timeStatsID },
      data: {
        sumTimeHrs,
      },
    });

    if (!updatedTimeManagement) {
      return new NextResponse(
        JSON.stringify({
          error: "Error while finding time management",
          details: `Data is not available or server issue.`,
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(
      JSON.stringify(`Your micro goal will be finished at: ${sumTimeHrs}`),
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
