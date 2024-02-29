import { makeRequest } from "./makeRequest";
import { ApiResponse, RootMapTreeType, TreeNode } from "@/types/type";
import { capitalized } from "./toolsUtils";
import { NodeDocument, NodeInput } from "@/model/type";
import NodeDocs from "@/model/NodeTree";

export async function insertMainNode({
  node,
  username,
}: NodeInput): Promise<ApiResponse<NodeInput>> {
  return await makeRequest(`/api/map-tree/${username}/main-node`, "POST", {
    node: capitalized(node),
  });
}

export async function retrieveFile(
  username: string
): Promise<ApiResponse<NodeInput>> {
  return await makeRequest(`/api/map-tree/${username}`, "GET");
}

export async function insertChildToNode({
  path,
  node,
  username,
}: NodeInput): Promise<ApiResponse<NodeInput>> {
  return await makeRequest(`/api/map-tree/${username}/sub-node`, "POST", {
    path: capitalized(path || ""),
    node: capitalized(node),
  });
}

export interface NodeTypeForUpdate {
  username: string;
  node: string;
  method: string;
  updatedNodeName?: string;
}

export async function updateNodeInTree({
  username,
  node,
  method,
  updatedNodeName,
}: NodeTypeForUpdate): Promise<ApiResponse<RootMapTreeType>> {
  const Update = updatedNodeName ? capitalized(updatedNodeName) : undefined;
  return await makeRequest(`/api/map-tree/${username}/sub-node`, "PUT", {
    node: capitalized(node),
    method,
    updatedNodeName: Update,
  });
}

export function defineAbsolutePath(nodes: NodeDocument[], path: string) {
  const findNode = nodes.find((node) => node.node === path);

  if (!findNode) return false;

  const newPath = findNode.path + `${findNode.node}` + "/";
  return newPath;
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
