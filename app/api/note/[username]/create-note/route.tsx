import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: { username: string } }
) => {
  try {
    const body = await req.json();
    const { title, desc, deadline } = body;
    const { username } = params;
    const newNote = await prisma.note.create({
      data: { title, desc, deadline, username },
    });

    if (!newNote)
      return new NextResponse(
        JSON.stringify({
          error: "Failed to add new note",
          details: "Invalid data or server issue",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );

    return new NextResponse(JSON.stringify(newNote, null, 2), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error: "Failed to create note",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
