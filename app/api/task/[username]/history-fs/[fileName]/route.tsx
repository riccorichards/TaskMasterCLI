import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { findFileByFileName } from "@/utils/fileUtils";

export const GET = async (
  req: NextRequest,
  { params }: { params: { fileName: string } }
) => {
  try {
    const { fileName } = params;
    const dir = path.join(process.cwd(), "tempCont", "history");
    const filePath = await findFileByFileName(dir, fileName);
    if (!filePath) {
      return new NextResponse(
        JSON.stringify({
          error: "Failed to find file",
          details: filePath,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await fs.readFile(filePath, "utf8");

    return new NextResponse(data, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error: "Server error",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
