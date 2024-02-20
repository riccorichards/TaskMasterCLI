import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { mapTree, userId } = body;

    if (!mapTree || !userId) {
      return new NextResponse(
        JSON.stringify({
          error: "Failed to add new task",
          details: "Invalid data or server issue.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const filePath = path.join(".", "tempCont", `mapTree-${userId}.json`);

    await fs.writeFile(filePath, JSON.stringify(mapTree, null, 2), "utf-8");

    return new NextResponse(JSON.stringify(mapTree, null, 2), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error: "Failed to create main node",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
