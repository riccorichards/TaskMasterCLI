"use client";

import React, { FC, useEffect } from "react";
import { useAuthStore } from "@/store/AuthStore";

const UserConnection: FC<{
  username: string;
  password: string;
  type: "signup" | "login";
  command: string;
}> = ({ username, password, command, type }) => {
  const { user, isLoading, error, signup, logIn } = useAuthStore();

  useEffect(() => {
    if (username && password && type === "signup") {
      signup({ username, password });
    }
  }, [username, password, type, signup]);

  useEffect(() => {
    if (username && password && type === "login") {
      logIn({ username, password });
    }
  }, [username, password, type, logIn]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("CLI-user", JSON.stringify(user));
    }
  }, [user]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col">
      {!user ? (
        <div>
          <div>{command}</div>
          <div>{error}</div>
        </div>
      ) : null}
    </div>
  );
};

export default UserConnection;
