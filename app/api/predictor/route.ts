import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const exam = searchParams.get("exam");
    const rank = Number(searchParams.get("rank"));

    if (!exam || !rank || rank <= 0) {
      return NextResponse.json(
        {
          error: "Please provide a valid exam and rank.",
        },
        { status: 400 }
      );
    }

    const results = await prisma.cutoff.findMany({
      where: {
        exam,
        closingRank: {
          gte: rank,
        },
      },

      include: {
        college: true,
        course: true,
      },

      orderBy: {
        closingRank: "asc",
      },
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("Predictor API Error:", error);

    return NextResponse.json(
      {
        error: "Failed to predict colleges.",
      },
      { status: 500 }
    );
  }
}