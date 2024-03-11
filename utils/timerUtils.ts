import { Command } from "@/app/page";
import { retrieveDailyTasks } from "./taskUtils";

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return [hours, minutes, remainingSeconds]
    .map((val) => String(val).padStart(2, "0"))
    .join(":");
}

export function terminalAreaLativeCmds(command: string, area: string) {
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

export function isRuntimer(
  cmdTitle: string,
  commands: Command[],
  area: string
): boolean {
  const findIndex = commands.findIndex((cmd) => {
    const validArea = cmd.command?.split("/>")[0].split("/")[2] === area;
    const command = cmd.command?.split("/>")[1]?.trim() ?? "";
    return validArea && command.startsWith(cmdTitle);
  });
  return findIndex !== -1;
}

export async function defineCorrectTitle(
  username: string,
  targetTitle: string
) {
  const dailyTasks = await retrieveDailyTasks(username);
  if (dailyTasks.status === "error") return dailyTasks.message;

  const { data } = dailyTasks;
  const res = data?.find((task) => task.title === targetTitle);
  return res ? (res.id as number) : null;
}
