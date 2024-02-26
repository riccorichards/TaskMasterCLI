import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { DailyTaskType } from "@/types/type";
import { prisma } from "@/lib/prisma";
import { findFileByFileName } from "@/utils/fileUtils";

export const POST = async (
  req: NextRequest,
  { params }: { params: { username: string } }
) => {
  try {
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

    const dir = path.join(process.cwd(), "tempCont", "history");
    const fileName = `history-${username}.json`;
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

    const fileData = await fs.readFile(filePath, "utf8");
    const historyFile = JSON.parse(fileData);

    if (!historyFile.children) {
      historyFile.children = [];
    }

    tasks.forEach((task: DailyTaskType) => {
      const { title, desc, done, spendMs } = task;
      historyFile.children.push({
        workSpace: title,
        task: desc,
        done,
        duration: spendMs,
        createdAt: new Date(),
      });
    });

    await fs.writeFile(filePath, JSON.stringify(historyFile, null, 2), "utf8");

    const deletePromises = tasks.map(
      async (task: DailyTaskType) =>
        await prisma.dailyTask.delete({ where: { id: task.id } })
    );
    await Promise.all(deletePromises);

    return new NextResponse(
      JSON.stringify("Successfully updated and removed tasks.", null, 2),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
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
