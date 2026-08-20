import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const colleges = await prisma.college.findMany({
      include: {
        courses: true,
        placements: true,
        ratings: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: colleges,
    });
  } catch (error) {
    console.error("Failed to fetch colleges:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch colleges",
      },
      { status: 500 }
    );
  }
}