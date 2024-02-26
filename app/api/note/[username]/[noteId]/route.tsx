import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { noteId: string } }
) => {
  try {
    const noteId = parseInt(params.noteId, 10);
    const note = await prisma.note.findUnique({ where: { id: noteId } });

    if (!note) {
      return new NextResponse(
        JSON.stringify({
          error: "Note not found",
          details: `A note with the ID ${noteId} does not exist.`,
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(JSON.stringify(note), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error: "Failed to retrieve note",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: { noteId: string; username: string } }
) => {
  try {
    const { complete } = await req.json();
    const { username } = params;
    const noteId = parseInt(params.noteId, 10);
    const updatedNote = await prisma.note.update({
      where: { id: noteId, username },
      data: {
        complete,
      },
    });

    if (!updatedNote)
      return new NextResponse(
        JSON.stringify({
          error: "Failed to update note",
          details:
            "Note was not found with provided ID or data is not available",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );

    return new NextResponse(JSON.stringify(updatedNote, null, 2), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error: "Failed to update note",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { noteId: string, username: string } }
) => {
  try {
    const noteId = parseInt(params.noteId, 10);
    const {username} = params
    await prisma.note.delete({ where: { id: noteId, username } });

    return new NextResponse(JSON.stringify("Successfully removed.", null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error: "Failed to removed note",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
