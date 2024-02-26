import path from "path";
import fs from "fs/promises";

export async function findFileByFileName(dir: string, fileName: string): Promise<string | false> {
  try {
    const files = await fs.readdir(dir);
    const file = files.find((f) => f.includes(fileName));
    return file ? path.join(dir, file) : false;
  } catch (error) {
    console.error("Error finding file by name:", error);
    return false;
  }
}