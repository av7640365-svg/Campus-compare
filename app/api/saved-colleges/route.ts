import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET SAVED COLLEGES
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        {
          error: "User ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const savedColleges = await prisma.savedCollege.findMany({
      where: {
        userId,
      },
      include: {
        college: {
          include: {
            courses: true,
            placements: true,
            ratings: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: savedColleges,
    });
  } catch (error) {
    console.error("GET_SAVED_COLLEGES_ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch saved colleges",
      },
      {
        status: 500,
      }
    );
  }
}

// SAVE COLLEGE
export async function POST(request: Request) {
  try {
    const { userId, collegeId } = await request.json();

    if (!userId || !collegeId) {
      return NextResponse.json(
        {
          error: "User ID and College ID are required",
        },
        {
          status: 400,
        }
      );
    }

    const existingSavedCollege =
      await prisma.savedCollege.findUnique({
        where: {
          userId_collegeId: {
            userId,
            collegeId,
          },
        },
      });

    if (existingSavedCollege) {
      return NextResponse.json(
        {
          error: "College already saved",
        },
        {
          status: 400,
        }
      );
    }

    const savedCollege = await prisma.savedCollege.create({
      data: {
        userId,
        collegeId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "College saved successfully",
        data: savedCollege,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("SAVE_COLLEGE_ERROR:", error);

    return NextResponse.json(
      {
        error: "Something went wrong while saving the college",
      },
      {
        status: 500,
      }
    );
  }
}

// REMOVE SAVED COLLEGE
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const userId = searchParams.get("userId");
    const collegeId = searchParams.get("collegeId");

    if (!userId || !collegeId) {
      return NextResponse.json(
        {
          error: "User ID and College ID are required",
        },
        {
          status: 400,
        }
      );
    }

    await prisma.savedCollege.delete({
      where: {
        userId_collegeId: {
          userId,
          collegeId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "College removed successfully",
    });
  } catch (error) {
    console.error("DELETE_SAVED_COLLEGE_ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to remove saved college",
      },
      {
        status: 500,
      }
    );
  }
}