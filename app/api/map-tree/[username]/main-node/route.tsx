import connectToMongoDB from "@/lib/connectToMongo";
import NodeDocs from "@/model/NodeTree";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: { username: string } }
) => {
  try {
    await connectToMongoDB();

    const body = await req.json();

    if (!body) {
      return new NextResponse(
        JSON.stringify({
          error: "Failed to add main node",
          details: "Invalid data or server issue.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { node } = body;
    const { username } = params;

    const newNode = await NodeDocs.create({ username, node, path: `/` });

    if (!newNode) {
      return new NextResponse(
        JSON.stringify({
          error: "Failed to add main node",
          details: "Invalid data or server issue.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(
      JSON.stringify({ success: true, newNode: await newNode.save() }, null, 2),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
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
