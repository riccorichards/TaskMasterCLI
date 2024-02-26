import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { username: string } }
) => {
  try {
    const { username } = params;
    const notes = await prisma.note.findMany({ where: { username } });

    if (notes.length === 0) throw new Error("Data is not availble...");

    return new NextResponse(JSON.stringify(notes, null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error: "Failed to retrieve all notes",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
