import { existingCmds } from "@/tempCont/index";
import { makeRequest } from "./makeRequest";
import { Command, TextCommand } from "@/app/page";
import fs from "fs";
import { MapTreeType } from "@/types/type";

class CmdsMethods {
  static help() {
    return existingCmds.map((cmd) => {
      return {
        title: cmd.cmd,
        desc: cmd.desc,
        id: cmd.id,
      };
    });
  }

  static async addTask({ title, desc }: { title: string; desc: string }) {
    try {
      const res = await makeRequest("/api/task/create-task", "POST", {
        title,
        desc,
      });
      if (!res) throw new Error("Error while creating a new task");

      return `Creating a new task done successfully: ${JSON.stringify(res)}`;
    } catch (error) {
      console.log(error);
    }
  }

  static async addPeriod(period: string) {
    try {
      const res = await makeRequest("/api/time-stats/add-period", "POST", {
        period,
      });
      if (!res) throw new Error("Error while add a new period");

      return `Your micro goal will be finished at ${JSON.stringify(res)}`;
    } catch (error) {
      console.log(error);
    }
  }

  static async addHrsForPeriod({
    sumTimeHrs,
    timeStatsID,
  }: {
    sumTimeHrs: number;
    timeStatsID: string;
  }) {
    try {
      const res = await makeRequest("/api/time-stats/add-sum-hrs", "PUT", {
        sumTimeHrs,
        timeStatsID,
      });
      if (!res) throw new Error("Error while add a new period");

      return `Your micro goal will be finished at ${JSON.stringify(res)}`;
    } catch (error) {
      console.log(error);
    }
  }

  static async editTask({
    taskId,
    title,
    desc,
  }: {
    taskId: string;
    title: string;
    desc: string;
  }) {
    try {
      const res = await makeRequest(`/api/task/${taskId}`, "PUT", {
        title,
        desc,
      });
      if (!res) throw new Error("Error while updating task");

      return `Successfully updated: ${JSON.stringify(res)}`;
    } catch (error) {
      console.log(error);
    }
  }

  static async doneTask({
    taskId,
    done,
    spendMs,
  }: {
    taskId: string;
    done: boolean;
    spendMs: number;
  }) {
    try {
      const res = await makeRequest(`/api/task/${taskId}`, "PUT", {
        done,
        spendMs,
      });
      if (!res) throw new Error("Error while declaring task as a done");

      return `Successfully declared: ${JSON.stringify(res)}`;
    } catch (error) {
      console.log(error);
    }
  }

  static async getTaskByIdFromDailyTask({ taskId }: { taskId: string }) {
    try {
      const res = await makeRequest(`/api/task/${taskId}`, "GET");
      if (!res) throw new Error("Error while fetching task");
      return `Successfully fetched: ${JSON.stringify(res)}`;
    } catch (error) {
      console.log(error);
    }
  }

  static async getTasksfromDailyTask() {
    try {
      const res = await makeRequest(`/api/task`, "GET");
      if (!res) throw new Error("Error while fetching task");
      return `Successfully fetched: ${JSON.stringify(res)}`;
    } catch (error) {
      console.log(error);
    }
  }

  static async removeTask(taskId: string) {
    try {
      await makeRequest(`/api/task/${taskId}`, "DELETE");
      return `Successfully Removed.`;
    } catch (error) {
      console.log(error);
    }
  }

  static async addNote({
    title,
    desc,
    deadline,
  }: {
    title: string;
    desc: string;
    deadline: string;
  }) {
    try {
      const res = await makeRequest(`/api/note/create-note`, "POST", {
        title,
        desc,
        deadline,
      });
      if (!res) throw new Error("Error while adding a new note");
      return `Successfully Added note: ${JSON.stringify(res)}`;
    } catch (error) {
      console.log(error);
    }
  }

  static async editNote({
    noteId,
    title,
    desc,
    deadline,
  }: {
    noteId: string;
    title: string;
    desc: string;
    deadline: string;
  }) {
    try {
      const res = await makeRequest(`/api/note/${noteId}`, "PUT", {
        title,
        desc,
        deadline,
      });
      if (!res) throw new Error("Error while updating note");
      return `Successfully updated note: ${JSON.stringify(res)}`;
    } catch (error) {
      console.log(error);
    }
  }

  static async doneNote({
    noteId,
    complete,
  }: {
    noteId: string;
    complete: boolean;
  }) {
    try {
      const res = await makeRequest(`/api/note/${noteId}`, "PUT", {
        complete,
      });
      if (!res) throw new Error("Error while updating note");
      return `Successfully updated note: ${JSON.stringify(res)}`;
    } catch (error) {
      console.log(error);
    }
  }

  static async removeNote(noteId: string) {
    try {
      await makeRequest(`/api/note/${noteId}`, "DELETE");
      return `Successfully Removed.`;
    } catch (error) {
      console.log(error);
    }
  }

  static formatDuration(seconds: number): string {
    seconds += 1;

    const hours = Math.floor(seconds / 3600);
    let remainingSeconds = seconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    remainingSeconds %= 60;

    return [hours, minutes, remainingSeconds]
      .map((val) => String(val).padStart(2, "0"))
      .join(":");
  }

  static terminalAreaLativeCmds(command: string, area: string) {
    switch (area) {
      case "timer":
        const runTimerRegax = /^run timer for\s*(.+)$/;
        const pauseTimetRegax = /^pause timer where title =\s*(.+)$/;
        const reRunTimetRegax = /^re-run timer where title =\s*(.+)$/;
        if (
          runTimerRegax.test(command) ||
          pauseTimetRegax.test(command) ||
          reRunTimetRegax.test(command)
        ) {
          return true;
        }
        return false;
    }
  }

  static responseTextOutput(
    command: string,
    type: "error" | "success",
    output?: string
  ): TextCommand {
    if (type === "error") {
      return {
        type: "text",
        command,
        textOutput: `Error: Unknown command: ${command.split("/>")[1]}`,
      };
    } else {
      return {
        type: "text",
        command,
        textOutput: `Success: ${output}`,
      };
    }
  }

  static isRuntimer(
    cmdTitle: string,
    commands: Command[],
    area: string
  ): boolean {
    const findIndex = commands.findIndex((cmd) => {
      const validAred = cmd.command?.split("/>")[0].split("/")[2] === area;
      const command = cmd.command?.split("/>")[1]?.trim() ?? "";
      return validAred && command.startsWith(cmdTitle);
    });
    return findIndex !== -1;
  }

  static capitalized(str: string) {
    const firstChar = str.charAt(0);
    return firstChar + str.slice(1);
  }

  static async insertMainNode(mainNode: string) {
    const mainGoal = this.capitalized(mainNode);

    const mapTree: MapTreeType = {
      user: "1531",
      userTree: {
        name: mainGoal,
        children: [],
      },
    };

    const res = await makeRequest("/api/map-tree", "POST", { mapTree });

    console.log(res, "in methods");
    if (!res) return false;

    return res;
  }
}

export default CmdsMethods;
