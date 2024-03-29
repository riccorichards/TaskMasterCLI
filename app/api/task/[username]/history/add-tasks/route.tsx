import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import connectToMongoDB from "@/lib/connectToMongo";
import History from "@/model/History";
import { DailyTaskType } from "@/types/type";

export const POST = async (
  req: NextRequest,
  { params }: { params: { username: string } }
) => {
  try {
    await connectToMongoDB();
    const body = await req.json();
    const { tasks } = body;
    const { username } = params;

    if (!Array.isArray(tasks) || tasks.length === 0) {
      return new NextResponse(
        JSON.stringify({
          error: "Invalid request",
          details: "No tasks provided.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    let userHistory = await History.findOne({ username });

    if (!userHistory) {
      userHistory = await History.create({ username, myHistory: [] });
    }

    tasks.forEach((task: DailyTaskType) => {
      const { title, desc, done, spendMs } = task;
      userHistory.myHistory.push({
        workSpace: title,
        task: desc,
        done,
        duration: spendMs,
        createdAt: new Date(),
      });
    });

    await userHistory.save();

    const deletePromises = tasks.map(
      async (task: DailyTaskType) =>
        await prisma.dailyTask.delete({ where: { id: task.id } })
    );

    await Promise.all(
      deletePromises.map((p) => p.catch((e) => console.error(e)))
    );

    return new NextResponse(
      JSON.stringify("Successfully updated and removed tasks.", null, 2),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
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
