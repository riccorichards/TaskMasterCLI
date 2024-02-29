import { NextRequest, NextResponse } from "next/server";
import connectToMongoDB from "@/lib/connectToMongo";
import History from "@/model/History";

export const GET = async (
  req: NextRequest,
  { params }: { params: { username: string } }
) => {
  try {
    await connectToMongoDB();
    const { username } = params;

    const myHystory = await History.find({ username });

    return new NextResponse(JSON.stringify(myHystory[0], null, 2), {
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
