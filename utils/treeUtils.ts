import { makeRequest } from "./makeRequest";
import { MapTreeType, RootMapTreeType } from "@/types/type";
import { capitalized, errorhandler } from "./toolsUtils";

export async function insertMainNode(mainNode: string) {
  const mainGoal = capitalized(mainNode);

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
    errorhandler(error);
  }
}

export async function retrieveFile(fileName: string) {
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
    errorhandler(error);
    throw new Error(`File was not found with provided: ${fileName}`);
  }
}

export async function insertChildToNode(
  nodeName: string,
  childName: string,
  user: string
) {
  const newNodeName = capitalized(childName);

  const newNode: MapTreeType = {
    name: newNodeName,
    children: [],
  };

  try {
    const res = await makeRequest("/api/map-tree/sub-node", "POST", {
      nodeName: capitalized(nodeName),
      newNode,
      user,
    });

    if (!res) return false;

    return res;
  } catch (error) {
    errorhandler(error);
    throw new Error(`Error while inserting a new node: ${newNode}`);
  }
}

export async function removeNode(
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
    errorhandler(error);
    throw new Error(
      `File was not found with provided: ${fileName} or server issue`
    );
  }
}
