import { makeRequest } from "./makeRequest";
import {
  ApiResponse,
  MapTreeType,
  RootMapTreeType,
  TreeNode,
} from "@/types/type";
import { capitalized, errorhandler } from "./toolsUtils";

export async function insertMainNode({
  mainNode,
  username,
}: {
  mainNode: string;
  username: string;
}): Promise<
  ApiResponse<{
    mainNode: string;
    username: string;
  }>
> {
  const mainGoal = capitalized(mainNode);

  const mapTree: RootMapTreeType = {
    user: username,
    userTree: {
      name: mainGoal,
      children: [],
    },
  };
  const fileName = `mapTree-${username}.json`;

  return await makeRequest(`/api/map-tree/${fileName}/main-node`, "POST", {
    mapTree,
  });
}

export async function retrieveFile(
  fileName: string
): Promise<ApiResponse<RootMapTreeType>> {
  return await makeRequest(`/api/map-tree/${fileName}`, "GET");
}

export async function insertChildToNode({
  nodeName,
  childName,
  fileName,
}: {
  nodeName: string;
  childName: string;
  fileName: string;
}): Promise<ApiResponse<RootMapTreeType>> {
  const newNodeName = capitalized(childName);

  const newNode: MapTreeType = {
    name: newNodeName,
    children: [],
  };

  return await makeRequest(`/api/map-tree/${fileName}/sub-node`, "POST", {
    nodeName: capitalized(nodeName),
    newNode,
  });
}

export async function updateNodeInTree({
  fileName,
  nodeName,
  method,
  updatedNodeName,
}: {
  fileName: string;
  nodeName: string;
  method: string;
  updatedNodeName?: string;
}): Promise<ApiResponse<RootMapTreeType>> {
  return await makeRequest(`/api/map-tree/${fileName}/sub-node`, "PUT", {
    nodeName,
    method,
    updatedNodeName,
  });
}

export const addNodeToTree = (
  node: TreeNode,
  nodeName: string,
  newNode: TreeNode
): boolean => {
  nodeName = nodeName.trim();
  if (node.name === nodeName) {
    node.children.push(newNode);
    return true;
  }

  for (const child of node.children) {
    if (addNodeToTree(child, nodeName, newNode)) {
      return true;
    }
  }

  return false;
};

export const updateNodeIntoTree = (
  node: TreeNode,
  nodeName: string,
  method: "remove" | "update",
  updatedNodeName?: string
): boolean => {
  nodeName = nodeName.trim();

  if (node.name === nodeName) {
    if (method === "update" && updatedNodeName) {
      node.name = updatedNodeName;
    } else if (method === "remove") {
      return false;
    }
    return true;
  }

  for (let i = 0; i < node.children.length; i++) {
    if (node.children[i].name === nodeName) {
      if (method === "update" && updatedNodeName) {
        node.children[i].name = updatedNodeName;
      } else if (method === "remove") {
        node.children.splice(i, 1);
      }

      return true;
    }

    if (
      updateNodeIntoTree(node.children[i], nodeName, method, updatedNodeName)
    ) {
      return true;
    }
  }

  return false;
};
