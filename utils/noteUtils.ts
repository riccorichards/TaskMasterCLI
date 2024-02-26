import { ApiResponse, InsertNoteType } from "@/types/type";
import { makeRequest } from "./makeRequest";
import { errorhandler } from "./toolsUtils";

export async function addNote({
  title,
  desc,
  deadline,
  username,
}: InsertNoteType): Promise<ApiResponse<InsertNoteType>> {
  return await makeRequest(`/api/note/${username}/create-note`, "POST", {
    title,
    desc,
    deadline,
  });
}

export async function doneNote({
  noteId,
  complete,
  username,
}: {
  noteId: string;
  complete: boolean;
  username: string;
}): Promise<
  ApiResponse<{ noteId: string; complete: boolean; username: string }>
> {
  return await makeRequest(`/api/note/${username}/${noteId}`, "PUT", {
    complete,
  });
}

export async function removeNote(
  noteId: string,
  username: string
): Promise<ApiResponse<{ noteId: string; username: string }>> {
  return await makeRequest(`/api/note/${username}/${noteId}`, "DELETE");
}

export async function retrieveNotes(
  username: string
): Promise<ApiResponse<string>> {
  return await makeRequest(`/api/note/${username}`);
}
