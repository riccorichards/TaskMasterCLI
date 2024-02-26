import { existingCmds } from "@/tempCont/index";
import { TextCommand } from "@/types/type";

export function help() {
  return existingCmds.map((cmd) => {
    return {
      title: cmd.cmd,
      desc: cmd.desc,
      id: cmd.id,
    };
  });
}

export function errorhandler(
  error: unknown,
  errorOutput?: string
): { status: string; response: any } {
  if (error instanceof Error) {
    return responsehandler("error", error.message);
  }
  const errorExec = errorOutput ? errorOutput : "Unknown error: " + error;
  return responsehandler("error", errorExec);
}

export function responsehandler(status: string, response: any) {
  return {
    status,
    response,
  };
}

export function responseTextOutput(
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

export function capitalized(str: string) {
  const firstChar = str.charAt(0).toUpperCase();
  return firstChar + str.slice(1);
}

export function formatingDate(createAt: string) {
  const [date, time] = createAt.split("T");
  const [hr, min] = time ? time.split(":") : ["00", "00"];
  return {
    date,
    time: `${hr}:${min}`,
  };
}

export function refreshPage() {
  return window.location.reload();
}

export function logout() {
  localStorage.removeItem("CLI-user");
  return refreshPage();
}
