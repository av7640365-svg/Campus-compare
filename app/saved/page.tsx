"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type SavedCollege = {
  id: string;
  collegeId: string;
  college: {
    id: string;
    name: string;
    city: string;
    state: string;
    collegeType: string;
  };
};

export default function SavedPage() {
  const [savedColleges, setSavedColleges] = useState<SavedCollege[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSavedColleges() {
      const userData = localStorage.getItem("user");

      if (!userData) {
        setLoading(false);
        return;
      }

      try {
        const user = JSON.parse(userData);

        const response = await fetch(
          `/api/saved-colleges?userId=${user.id}`
        );

        const result = await response.json();

        if (response.ok && result.success) {
          setSavedColleges(result.data);
        }
      } catch (error) {
        console.error("FETCH_SAVED_COLLEGES_ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSavedColleges();
  }, []);

  const removeCollege = async (collegeId: string) => {
    const userData = localStorage.getItem("user");

    if (!userData) return;

    setRemovingId(collegeId);

    try {
      const user = JSON.parse(userData);

      const response = await fetch(
        `/api/saved-colleges?userId=${user.id}&collegeId=${collegeId}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Failed to remove college");
        return;
      }

      setSavedColleges((currentColleges) =>
        currentColleges.filter(
          (item) => item.collegeId !== collegeId
        )
      );
    } catch (error) {
      console.error("REMOVE_SAVED_COLLEGE_ERROR:", error);
      alert("Something went wrong while removing the college.");
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 sm:py-12">
        <div className="py-20 text-center text-sm text-gray-500 sm:text-base">
          Loading saved colleges...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 sm:text-sm">
            Your Collection
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            Saved Colleges
          </h1>

          <p className="mt-3 text-sm text-gray-600 sm:text-base">
            Colleges you have saved for later comparison.
          </p>
        </div>

        {/* Empty State */}
        {savedColleges.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center sm:p-12">
            <p className="text-lg font-semibold text-gray-900 sm:text-xl">
              No saved colleges yet
            </p>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Explore colleges and save the ones you are interested in.
            </p>

            <Link
              href="/colleges"
              className="mt-6 inline-block w-full rounded-lg bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto sm:text-base"
            >
              Explore Colleges
            </Link>
          </div>
        ) : (
          <>
            {/* Saved Count */}
            <p className="mb-5 text-sm text-gray-600 sm:text-base">
              You have{" "}
              <span className="font-semibold text-gray-900">
                {savedColleges.length}
              </span>{" "}
              saved{" "}
              {savedColleges.length === 1 ? "college" : "colleges"}.
            </p>

            {/* Cards */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
              {savedColleges.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
                >
                  <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 sm:text-sm">
                    {item.college.collegeType}
                  </span>

                  <h2 className="mt-4 break-words text-lg font-bold text-gray-900 sm:text-xl">
                    {item.college.name}
                  </h2>

                  <p className="mt-2 text-sm text-gray-500 sm:text-base">
                    📍 {item.college.city}, {item.college.state}
                  </p>

                  <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Link
                      href={`/colleges/${item.college.id}`}
                      className="rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      View Details
                    </Link>

                    <button
                      onClick={() =>
                        removeCollege(item.collegeId)
                      }
                      disabled={
                        removingId === item.collegeId
                      }
                      className="rounded-lg border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {removingId === item.collegeId
                        ? "Removing..."
                        : "Remove"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
