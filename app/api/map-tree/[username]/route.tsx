import connectToMongoDB from "@/lib/connectToMongo";
import NodeDocs from "@/model/NodeTree";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { username: string } }
) => {
  try {
    const { username } = params;

    await connectToMongoDB()
      .then(() => console.log("Success"))
      .catch((err) => err);

    const nodes = await NodeDocs.find({ username }).lean();

    if (nodes.length === 0)
      return new NextResponse(
        JSON.stringify("Data is not exising...", null, 2),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );

    const buildHierarchy = (username: string) => {
      const usersNodes = nodes.filter((node) => node.username === username);

      const findChildren = (parentPath: string): any => {
        return usersNodes
          .filter((node) => node.path === parentPath)
          .map((node) => ({
            name: node.node,
            children: findChildren(parentPath + node.node + "/"),
          }));
      };

      // Start building the hierarchy from the root '/'
      const hierarchy = findChildren(`/`);

      return hierarchy;
    };

    const hierarchy = buildHierarchy(username)[0];

    return new NextResponse(JSON.stringify(hierarchy, null, 2), {
      status: 200,
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
