import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function findFileByFileName(dir: string, fileName: string) {
  const files = fs.readdirSync(dir);
  const file = files.find((f) => f.includes(fileName));

  if (!file) throw new Error(`File was not found with procided: ${fileName}`);

  return path.join(dir, file);
}

export const GET = async (
  req: NextRequest,
  { params }: { params: { fileName: string } }
) => {
  try {
    const { fileName } = params;

    const dir = path.join(process.cwd(), "tempCont", "mapTreeData");
    const filePath = await findFileByFileName(dir, fileName as string);

    if (!filePath) {
      return new NextResponse(
        JSON.stringify({
          error: "Failed to find file",
          details: "Invalid data or server issue.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = fs.readFileSync(filePath, "utf8");

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
