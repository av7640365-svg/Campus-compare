import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET SAVED COMPARISONS
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const savedComparisons =
      await prisma.savedComparison.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json({
      success: true,
      data: savedComparisons,
    });
  } catch (error) {
    console.error("GET_SAVED_COMPARISONS_ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch saved comparisons" },
      { status: 500 }
    );
  }
}

// SAVE COMPARISON
export async function POST(request: Request) {
  try {
    const { userId, college1Id, college2Id } =
      await request.json();

    if (!userId || !college1Id || !college2Id) {
      return NextResponse.json(
        {
          error:
            "User ID and both College IDs are required",
        },
        { status: 400 }
      );
    }

    if (college1Id === college2Id) {
      return NextResponse.json(
        {
          error: "Please select two different colleges",
        },
        { status: 400 }
      );
    }

    const existingComparison =
      await prisma.savedComparison.findFirst({
        where: {
          userId,
          OR: [
            {
              college1Id,
              college2Id,
            },
            {
              college1Id: college2Id,
              college2Id: college1Id,
            },
          ],
        },
      });

    if (existingComparison) {
      return NextResponse.json(
        {
          error: "This comparison is already saved",
        },
        { status: 400 }
      );
    }

    const savedComparison =
      await prisma.savedComparison.create({
        data: {
          userId,
          college1Id,
          college2Id,
        },
      });

    return NextResponse.json(
      {
        success: true,
        message: "Comparison saved successfully",
        data: savedComparison,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("SAVE_COMPARISON_ERROR:", error);

    return NextResponse.json(
      {
        error: "Something went wrong while saving comparison",
      },
      { status: 500 }
    );
  }
}

// DELETE SAVED COMPARISON
// DELETE SAVED COMPARISON
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const userId = searchParams.get("userId");
    const comparisonId = searchParams.get("comparisonId");

    if (!userId || !comparisonId) {
      return NextResponse.json(
        {
          error: "User ID and Comparison ID are required",
        },
        { status: 400 }
      );
    }

    const result = await prisma.savedComparison.deleteMany({
      where: {
        id: comparisonId,
        userId,
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        {
          error: "Comparison not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Comparison removed successfully",
    });
  } catch (error) {
    console.error("DELETE_SAVED_COMPARISON_ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to remove saved comparison",
      },
      { status: 500 }
    );
  }
}