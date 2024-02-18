import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { taskId: string } }
) => {
  try {
    const { taskId } = params;
    const task = await prisma.dailyTask.findUnique({ where: { id: taskId } });

    if (!task) {
      return new NextResponse(
        JSON.stringify({
          error: "Task not found",
          details: `A task with the ID ${taskId} does not exist.`,
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(JSON.stringify(task), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
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

export const PUT = async (
  req: NextRequest,
  { params }: { params: { noteId: string } }
) => {
  try {
    const { title, desc, deadline, complete } = await req.json();
    const { noteId } = params;
    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: {
        title,
        desc,
        deadline,
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
  { params }: { params: { noteId: string } }
) => {
  try {
    const { noteId } = params;

    await prisma.note.delete({ where: { id: noteId } });

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
