import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const POST = async (
  req: NextRequest,
  { params }: { params: { fileName: string } }
) => {
  try {
    const body = await req.json();
    const { mapTree } = body;
    const { fileName } = params;

    if (!mapTree) {
      return new NextResponse(
        JSON.stringify({
          error: "Failed to add main node",
          details: "Invalid data or server issue.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const filePath = path.join(".", "tempCont", "mapTreeData", `${fileName}`);


    await fs.writeFile(filePath, JSON.stringify(mapTree, null, 2), "utf-8");

    return new NextResponse(JSON.stringify({ success: true, mapTree }), {
      status: 201,
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
