"use client";

import { useTaskStore } from "@/store/TaskStore";
import { FC, useEffect } from "react";

const Notes: FC<{ username: string }> = ({ username }) => {
  const { notes, isLoading, error, fetchNotes } = useTaskStore();

  useEffect(() => {
    if (username) {
      fetchNotes(username);
    }
  }, [fetchNotes, username]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col border border-dashed w-full">
      <div className="flex items-center justify-between font-bold w-full">
        <span className="flex flex-1 self-center">#ID</span>
        <span className="flex flex-1 self-center">Title</span>
        <span className="flex flex-1 self-center">Description</span>
        <span className="flex flex-1 self-center">Deadline</span>
        <span className="flex flex-1 self-center">Complete</span>
        <span className="flex flex-1 self-center">Created at</span>
      </div>
      {notes &&
        notes.map((note) => (
          <div
            key={note.id}
            className={`flex items-center justify-between ${
              note.complete ? "opacity-100" : "opacity-70"
            } border-b border-dashed`}
          >
            <span className="flex flex-1 self-center">#{note.id}</span>
            <span className="flex flex-1 self-center">{note.title}</span>
            <span className="flex flex-1 self-center">{note.desc}</span>
            <span className="flex flex-1 self-center">{note.deadline}</span>
            <span className="flex flex-1 self-center">
              {note.complete ? "True" : "False"}
            </span>
            <span className="flex flex-1 self-center">
              {new Date(note.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))}
    </div>
  );
};

export default Notes;
