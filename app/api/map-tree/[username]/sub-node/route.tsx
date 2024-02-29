import { NextRequest, NextResponse } from "next/server";
import { defineAbsolutePath } from "@/utils/treeUtils";
import connectToMongoDB from "@/lib/connectToMongo";
import NodeDocs from "@/model/NodeTree";

export const POST = async (
  req: NextRequest,
  { params }: { params: { username: string } }
) => {
  try {
    await connectToMongoDB()
      .then(() => console.log("Success"))
      .catch((err) => err);

    const body = await req.json();
    const { username } = params;

    if (!body) {
      return new NextResponse(
        JSON.stringify({
          error: "Failed to add node",
          details: "Invalid data or server issue.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { path, node } = body;

    const nodes = await NodeDocs.find({ username });

    const newAbsolutePath = defineAbsolutePath(nodes, path);

    const newNode = await NodeDocs.create({
      username,
      node,
      path: newAbsolutePath,
    });

    if (newNode) {
      return new NextResponse(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
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
  { params }: { params: { username: string } }
) => {
  try {
    await connectToMongoDB();
    const body = await req.json();
    const { username } = params;

    if (!body) {
      return new NextResponse(
        JSON.stringify({
          error: "Invalid data",
          details: "Invalid data or server issue.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { node, method, updatedNodeName } = body;

    let responseMessage = "";
    let statusCode = 200;

    if (method === "remove") {
      const removeNode = await NodeDocs.findOneAndDelete({ username, node });

      const regex = new RegExp(`/${node}/`);

      const removeNodeSubnodes = await NodeDocs.deleteMany({
        username,
        path: { $regex: regex },
      });

      if (!removeNodeSubnodes || !removeNode) {
        responseMessage = JSON.stringify({
          error: "Server issue",
          details: "Data is not available or server issue",
        });
        statusCode = 500;
      } else {
        responseMessage = "Successfully removed...";
      }
    } else if (method === "update") {
      const updatedNode = await NodeDocs.findOneAndUpdate(
        { username, node },
        { $set: { node: updatedNodeName } },
        { new: true }
      );

      const regexUpdate = new RegExp(`/${node}/`);

      const subNodes = await NodeDocs.find({
        username,
        path: { $regex: regexUpdate },
      });

      for (const subNode of subNodes) {
        const newPath = subNode.path.replace(
          `/${node}/`,
          `/${updatedNodeName}/`
        );
        await NodeDocs.updateOne(
          { _id: subNode._id },
          {
            $set: { path: newPath },
          }
        );
      }
      if (!updatedNode) {
        responseMessage = JSON.stringify({
          error: "Server error",
          details: "Node not found or update failed",
        });
        statusCode = 500;
      } else {
        responseMessage = "Successfully updated...";
      }
    }

    return new NextResponse(JSON.stringify(responseMessage, null, 2), {
      status: statusCode,
      headers: { "Content-Type": "application/json" },
    });
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
