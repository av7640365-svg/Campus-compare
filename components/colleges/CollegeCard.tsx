"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";



type College = {
  id: string;
  name: string;
  city: string;
  state: string;
  collegeType: string;
  establishedYear: number | null;
  description: string | null;

  courses: {
    id: string;
    name: string;
    degree: string | null;
    duration: string | null;
    fees: number | null;
  }[];

  placements: {
    averagePackage: number | null;
    highestPackage: number | null;
    placementPercent: number | null;
  } | null;

  ratings: {
    overall: number | null;
  } | null;
};

type CollegeCardProps = {
  college: College;
};

export default function CollegeCard({
  college,
}: CollegeCardProps) {

    const router = useRouter();

const [isSaved, setIsSaved] = useState(false);
const [saving, setSaving] = useState(false);

useEffect(() => {
  async function checkSavedStatus() {
    const userData = localStorage.getItem("user");

    if (!userData) {
      setIsSaved(false);
      return;
    }

    const user = JSON.parse(userData);

    try {
      const response = await fetch(
        `/api/saved-colleges?userId=${user.id}`
      );

      const result = await response.json();

      if (result.success) {
        const alreadySaved = result.data.some(
          (item: { collegeId: string }) =>
            item.collegeId === college.id
        );

        setIsSaved(alreadySaved);
      }
    } catch (error) {
      console.error("CHECK_SAVED_ERROR:", error);
    }
  }

  checkSavedStatus();
}, [college.id]);

const toggleSave = async () => {
  const userData = localStorage.getItem("user");

  if (!userData) {
    alert("Please login first to save colleges.");
    return;
  }

  const user = JSON.parse(userData);

  setSaving(true);

  try {
    if (isSaved) {
      const response = await fetch(
        `/api/saved-colleges?userId=${user.id}&collegeId=${college.id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Failed to remove college");
        return;
      }

      setIsSaved(false);
    } else {
      const response = await fetch("/api/saved-colleges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          collegeId: college.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Failed to save college");
        return;
      }

      setIsSaved(true);
    }
  } catch (error) {
    console.error("SAVE_COLLEGE_ERROR:", error);
    alert("Something went wrong.");
  } finally {
    setSaving(false);
  }
};

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-lg sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">
            {college.collegeType}
          </span>

          <h2 className="mt-4 text-lg font-bold text-gray-900 sm:text-xl">
            {college.name}
          </h2>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            📍 {college.city}, {college.state}
          </p>
        </div>

        {college.ratings?.overall && (
          <div className="rounded-lg bg-green-50 px-3 py-2 text-sm font-semibold text-green-700">
            ⭐ {college.ratings.overall}
          </div>
        )}
      </div>

      {college.description && (
        <p className="mt-4 line-clamp-2 text-sm text-gray-600">
          {college.description}
        </p>
      )}

     <div className="mt-6 grid grid-cols-1 gap-4 border-t border-gray-100 pt-5 sm:grid-cols-2">
        <div>
          <p className="text-sm text-gray-500">Average Package</p>
          <p className="mt-1 font-semibold text-gray-900">
            {college.placements?.averagePackage
              ? `₹${college.placements.averagePackage} LPA`
              : "N/A"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Highest Package</p>
          <p className="mt-1 font-semibold text-gray-900">
            {college.placements?.highestPackage
              ? `₹${college.placements.highestPackage} LPA`
              : "N/A"}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-sm text-gray-500">
          Courses Available: {college.courses.length}
        </p>
      </div>

<button
  onClick={toggleSave}
  disabled={saving}
className={`mt-5 w-full rounded-lg border py-3 text-sm font-semibold transition sm:mt-6 sm:text-base ${
    isSaved
      ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
      : "border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100"
  } disabled:opacity-60`}
>
  {saving
    ? "Saving..."
    : isSaved
    ? "❤️ Saved"
    : "♡ Save College"}
</button>

     <Link
  href={`/colleges/${college.id}`}
  className="mt-3 block w-full rounded-lg bg-blue-600 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700 sm:mt-4 sm:text-base"
>
  View Details
</Link>
    </div>
  );
}