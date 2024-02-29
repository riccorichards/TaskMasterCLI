import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { findFileByFileName } from "@/utils/fileUtils";
import { addNodeToTree, updateNodeIntoTree } from "@/utils/treeUtils";

export const POST = async (
  req: NextRequest,
  { params }: { params: { fileName: string } }
) => {
  try {
    const body = await req.json();
    const { fileName } = params;
    if (!body) {
      return new NextResponse(
        JSON.stringify({
          error: "Failed to add node",
          details: "Invalid data or server issue.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { newNode, nodeName } = body;

    const dir = path.join(process.cwd(), "tempCont", "mapTreeData");
    const filePath = await findFileByFileName(dir, fileName);

    if (!filePath) {
      return new NextResponse(
        JSON.stringify({
          error: "Failed to find file",
          details: "Invalid data or server issue.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const mapData = fs.readFileSync(filePath, "utf8");
    const map = JSON.parse(mapData);

    const insertNewNode = addNodeToTree(map.userTree, nodeName, newNode);

    if (insertNewNode) {
      fs.writeFileSync(filePath, JSON.stringify(map, null, 2), "utf8");
      return new NextResponse(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new NextResponse(
        JSON.stringify({
          error: "Node not found",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error: "Server error",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: { fileName: string } }
) => {
  try {
    const body = await req.json();
    const { fileName } = params;
    if (!body) {
      return new NextResponse(
        JSON.stringify({
          error: "Invalid data",
          details: "Invalid data or server issue.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { nodeName, method, updatedNodeName } = body;

    const dir = path.join(process.cwd(), "tempCont", "mapTreeData");
    const filePath = await findFileByFileName(dir, fileName);

    if (!filePath) {
      return new NextResponse(
        JSON.stringify({
          error: "Failed to find file",
          details: "Invalid data or server issue.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const fileData = fs.readFileSync(filePath, "utf8");
    const jsonData = JSON.parse(fileData);

    const responseUpdatedNode = updateNodeIntoTree(
      jsonData.userTree,
      nodeName,
      method,
      updatedNodeName
    );

    if (responseUpdatedNode) {
      fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), "utf8");
      return new NextResponse(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new NextResponse(
        JSON.stringify({
          error: "Error while modifing node tree",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error: "Server error",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
