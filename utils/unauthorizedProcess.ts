import UserConnection from "@/components/UserConnection";
import { Command } from "@/app/page";
import { responseTextOutput } from "./toolsUtils";

export const unauthorizedProcess = async (
  command: string,
  originalCommand: string
): Promise<Command | void> => {
  const signUpRegax = /^sign up where username =\s*(.+?),\s*password =\s*(.+)$/;
  const loginRegax = /^login -U\s*(.+?)\s*-p\s*(.+)$/;

  if (signUpRegax.test(command)) {
    const matched = command.match(signUpRegax);
    if (matched) {
      const [, username, password] = matched;
      return {
        type: "component",
        command: originalCommand,
        componentOutput: UserConnection,
        props: {
          username,
          password,
          type: "signup",
          command: originalCommand,
        },
      };
    }
  } else if (loginRegax.test(command)) {
    const matched = command.match(loginRegax);
    if (matched) {
      const [, username, password] = matched;
      return {
        type: "component",
        command: originalCommand,
        componentOutput: UserConnection,
        props: {
          username,
          password,
          type: "login",
          command: originalCommand,
        },
      };
    }
  } else {
    const res = responseTextOutput(originalCommand, "error");
    return res;
  }
};
