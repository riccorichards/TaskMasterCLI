import { findFileByFileName } from "@/app/api/map-tree/get-map-tree/[fileName]/route";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { DailyTastType } from "@/types/type";
import { prisma } from "@/lib/prisma";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { tasks } = body;
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
    const fileName = `history-${tasks[0].username}.json`;
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

    tasks.forEach((task: DailyTastType) => {
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
      async (task: DailyTastType) =>
        await prisma.dailyTask.delete({ where: { title: task.title } })
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
