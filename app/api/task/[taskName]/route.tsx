import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { taskName: string } }
) => {
  try {
    const { taskName } = params;
    const decodedTaskName = decodeURIComponent(taskName);

    const task = await prisma.dailyTask.findUnique({
      where: { title: decodedTaskName },
    });

    if (!task) {
      return new NextResponse(
        JSON.stringify({
          error: "Task not found",
          details: `A task with the provided title: ${taskName} does not exist.`,
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
        error: "Failed to found task",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: { taskName: string } }
) => {
  try {
    const { title, desc, done, spendMs } = await req.json();
    const { taskName } = params;

    let updatedTask;
    if (title && desc) {
      updatedTask = await prisma.dailyTask.update({
        where: { title: taskName },
        data: {
          title,
          desc,
        },
      });
    } else {
      updatedTask = await prisma.dailyTask.update({
        where: { title: taskName },
        data: {
          done,
          spendMs,
        },
      });
    }

    if (!updatedTask)
      return new NextResponse(
        JSON.stringify({
          error: "Failed to update task",
          details:
            "Task was not found with provided ID or data is not availabe",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );

    return new NextResponse(JSON.stringify(updatedTask, null, 2), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error: "Failed to update task",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { taskName: string } }
) => {
  try {
    const { taskName } = params;
    await prisma.dailyTask.delete({ where: { title: taskName } });

    return new NextResponse(JSON.stringify("Successfully removed.", null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error: "Failed to removed task",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
