import { existingCmds } from "@/tempCont/index";
import { makeRequest } from "./makeRequest";
import { Command, TextCommand } from "@/app/page";
import {
  HistoryTastType,
  DailyTastType,
  MapTreeType,
  RootMapTreeType,
} from "@/types/type";
import groupBy from "lodash/groupBy";

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

  static errorhandler(error: unknown, errorOutput?: string): string {
    if (error instanceof Error) {
      return error.message;
    }
    console.error(error);
    const errorExec = errorOutput ? errorOutput : "Unknown error: " + error;
    return errorExec;
  }

  static async addTask({
    username,
    title,
    desc,
  }: {
    username: string;
    title: string;
    desc: string;
  }) {
    try {
      const res = await makeRequest("/api/task/create-task", "POST", {
        username,
        title,
        desc,
      });
      if (!res) throw new Error("Error while creating a new task");

      return `Creating a new task done successfully: ${JSON.stringify(res)}`;
    } catch (error) {
      this.errorhandler(error);
    }
  }

  static async addPeriod(period: string, username: string) {
    try {
      const res = await makeRequest("/api/time-stats/add-period", "POST", {
        period: new Date(period),
        username,
      });
      if (!res) throw new Error("Error while add a new period");

      return `Your micro goal will be finished at ${JSON.stringify(res)}`;
    } catch (error) {
      this.errorhandler(error);
    }
  }

  static async addHrsForPeriod({
    sumTimeHrs,
    username,
  }: {
    sumTimeHrs: number;
    username: string;
  }) {
    try {
      const res = await makeRequest("/api/time-stats/add-sum-hrs", "PUT", {
        sumTimeHrs,
        username,
      });
      if (!res) throw new Error("Error while add a new period");

      return `Your micro goal will be finished at ${JSON.stringify(res)}`;
    } catch (error) {
      this.errorhandler(error);
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
      this.errorhandler(error);
    }
  }

  static async removeTask(taskName: string) {
    try {
      await makeRequest(`/api/task/${taskName}`, "DELETE");
      return `Successfully Removed.`;
    } catch (error) {
      this.errorhandler(error);
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
      this.errorhandler(error);
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
      this.errorhandler(error);
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
      this.errorhandler(error);
    }
  }

  static async removeNote(noteId: string) {
    try {
      await makeRequest(`/api/note/${noteId}`, "DELETE");
      return `Successfully Removed.`;
    } catch (error) {
      this.errorhandler(error);
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
    output?: string,
    errorOutput?: string
  ): TextCommand {
    if (type === "error") {
      return {
        type: "text",
        command,
        textOutput: errorOutput
          ? errorOutput
          : `Error: Unknown command: ${command.split("/>")[1]}`,
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
    const firstChar = str.charAt(0).toUpperCase();
    return firstChar + str.slice(1);
  }

  static async insertMainNode(mainNode: string) {
    const mainGoal = this.capitalized(mainNode);

    const mapTree: RootMapTreeType = {
      user: "RiccoRichards",
      userTree: {
        name: mainGoal,
        children: [],
      },
    };

    try {
      const res = await makeRequest("/api/map-tree/main-node", "POST", {
        mapTree,
      });

      if (!res) return false;

      return res;
    } catch (error) {
      this.errorhandler(error);
    }
  }

  static async retrieveFile(fileName: string) {
    try {
      const res = await makeRequest(
        `/api/map-tree/get-map-tree/${fileName}`,
        "GET"
      );
      if (!res) {
        throw new Error(`File was not found with provided: ${fileName}`);
      }

      return res;
    } catch (error) {
      this.errorhandler(error);
      throw new Error(`File was not found with provided: ${fileName}`);
    }
  }

  static async insertChildToNode(
    nodeName: string,
    childName: string,
    user: string
  ) {
    const newNodeName = this.capitalized(childName);

    const newNode: MapTreeType = {
      name: newNodeName,
      children: [],
    };

    try {
      const res = await makeRequest("/api/map-tree/sub-node", "POST", {
        nodeName: this.capitalized(nodeName),
        newNode,
        user,
      });

      if (!res) return false;

      return res;
    } catch (error) {
      this.errorhandler(error);
      throw new Error(`Error while inserting a new node: ${newNode}`);
    }
  }

  static async removeNode(
    user: string,
    nodeName: string,
    method: string,
    updatedNodeName?: string
  ) {
    const fileName = `mapTree-${user}.json`;
    try {
      const res = await makeRequest(`/api/map-tree/sub-node`, "PUT", {
        fileName,
        nodeName,
        method,
        updatedNodeName,
      });
      if (!res) {
        console.log(res);
        throw new Error(
          `File was not found with provided: ${fileName} or server issue`
        );
      }

      return res;
    } catch (error) {
      this.errorhandler(error);
      throw new Error(
        `File was not found with provided: ${fileName} or server issue`
      );
    }
  }

  static formatingDate(createAt: string) {
    const [date, time] = createAt.split("T");
    const [hr, min] = time ? time.split(":") : ["00", "00"];
    return {
      date,
      time: `${hr}:${min}`,
    };
  }

  static async dayFinishMethod(username: string) {
    try {
      const res = await makeRequest(
        `/api/task/user-task/${username}`,
        "DELETE"
      );
      return res;
    } catch (error) {
      this.errorhandler(error);
      return `Error while processing day finish for: ${username}`;
    }
  }

  static completeTasks(tasks: DailyTastType[] | HistoryTastType[]) {
    return tasks.filter((task) => task.done).length;
  }

  static calcCompleteTasksPercentage(
    tasks: HistoryTastType[] | DailyTastType[]
  ) {
    return (this.completeTasks(tasks) / tasks.length) * 100;
  }

  static defineRemainDays(period: string, customDate: number | null = null) {
    const endTime = new Date(period);
    const toDay = customDate ? new Date(customDate) : new Date();

    //normalize both days at the start of the day
    endTime.setHours(0, 0, 0, 0);
    toDay.setHours(0, 0, 0, 0);

    //define the difference between target day and today in milleseconds
    const differentInTime = endTime.getTime() - toDay.getTime();
    //convert milleseconds into days
    const differenceInDays = Math.ceil(differentInTime / (1000 * 3600 * 24));
    return differenceInDays;
  }

  static totalQuality(
    tasks: HistoryTastType[],
    periodHrs: number,
    period: string
  ) {
    //define task result in percentage (complete / total) * 100
    const taskResult = this.calcCompleteTasksPercentage(tasks);

    //the first work day with our application
    const startDay = tasks[0].createdAt;
    //it calculates the entire days from the first day to the target day
    const remainDays = this.defineRemainDays(period, startDay);
    //it calculates percentage: total hours / the remain days
    const workHrsPerDay = periodHrs / remainDays; // example 250 hrs / 50 days = 5 hrs per day

    //defines the remains days from today
    const remainDaysFromToday = this.defineRemainDays(period);
    const currentWorkHrsPerDay = periodHrs / remainDaysFromToday;

    //defiens the percentage of our works
    const workingHrsQuality = (workHrsPerDay / currentWorkHrsPerDay) * 100;

    return (taskResult + workingHrsQuality) / 2;
  }

  static totalWorkingHrs(tasks: HistoryTastType[]) {
    return this.formatDuration(
      tasks.reduce((acc, task) => acc + task.duration, 0)
    );
  }

  static groupedTaskByField(tasks: HistoryTastType[], field: string) {
    return groupBy(tasks, field);
  }

  static toplearnedTopics(tasks: HistoryTastType[]) {
    const groupedTasks = this.groupedTaskByField(tasks, "workSpace");
    const result = [];
    for (const workSpace in groupedTasks) {
      const workspaceTasks = groupedTasks[workSpace];
      const workSpaceLen = workspaceTasks.length * 0.45;
      const workSpaceCompletion = this.completeTasks(workspaceTasks) * 0.2;
      const workSpaceDuration =
        (workspaceTasks.reduce((sum, task) => sum + task.duration, 0) / 450) *
        0.35;

      const value = workSpaceCompletion + workSpaceDuration + workSpaceLen;
      result.push({
        name: workSpace,
        value,
      });
    }

    return result.sort((a, b) => b.value - a.value).slice(0, 10);
  }

  static dailyProgress(tasks: HistoryTastType[]) {
    const groupedTasks = this.groupedTaskByField(tasks, "createdAt");
    const result = [];

    for (const date in groupedTasks) {
      const dailyTask = groupedTasks[date];
      const completeTasks = this.completeTasks(dailyTask);

      result.push({
        date,
        value: (completeTasks / dailyTask.length) * 100,
      });
    }

    return result;
  }

  static refreshPage() {
    return window.location.reload();
  }

  static logout() {
    localStorage.removeItem("CLI-user");
    return this.refreshPage();
  }
}

export default CmdsMethods;
