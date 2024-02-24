import UserConnection from "@/components/UserConnection";
import CmdsMethods from "./methods";

export const unauthorizedProcess = (
  command: string,
  originalCommand: string
) => {
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
    const res = CmdsMethods.responseTextOutput(originalCommand, "error");
    return res;
  }
};
