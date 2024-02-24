import { prisma } from "@/lib/prisma";
import CmdsMethods from "@/utils/methods";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { username: string } }
) => {
  try {
    const { username } = params;

    const stats = await prisma.timeStats.findFirst({
      where: { username },
    });

    if (!stats)
      return new NextResponse(
        JSON.stringify({
          error: "Stats not found",
          details: "Stats was not found with provided:" + username,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );

    const { endTime, sumTimeHrs } = stats;

    const remainDays = CmdsMethods.defineRemainDays(endTime);
    const perDayWorkingHrs = sumTimeHrs / remainDays;

    return new NextResponse(
      JSON.stringify(
        { endTime: CmdsMethods.formatingDate(endTime).date, sumTimeHrs, remainDays, perDayWorkingHrs },
        null,
        2
      ),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error: "Failed to found stats",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
