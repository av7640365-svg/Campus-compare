"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type College = {
  id: string;
  name: string;
  city: string;
  state: string;
};

type SavedComparison = {
  id: string;
  college1Id: string;
  college2Id: string;
  createdAt: string;
};

export default function SavedComparisonsPage() {
  const [comparisons, setComparisons] = useState<
    SavedComparison[]
  >([]);

  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const userData = localStorage.getItem("user");

      if (!userData) {
        setLoading(false);
        return;
      }

      const user = JSON.parse(userData);

      try {
        const comparisonResponse = await fetch(
          `/api/saved-comparisons?userId=${user.id}`
        );

        const comparisonResult =
          await comparisonResponse.json();

        const collegeResponse =
          await fetch("/api/colleges");

        const collegeResult =
          await collegeResponse.json();

        if (comparisonResult.success) {
          setComparisons(comparisonResult.data);
        }

        if (collegeResult.success) {
          setColleges(collegeResult.data);
        }
      } catch (error) {
        console.error(
          "FETCH_SAVED_COMPARISONS_ERROR:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const removeComparison = async (
    comparisonId: string
  ) => {
    const userData = localStorage.getItem("user");

    if (!userData) return;

    const user = JSON.parse(userData);

    try {
      const response = await fetch(
        `/api/saved-comparisons?userId=${user.id}&comparisonId=${comparisonId}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(
          result.error ||
            "Failed to remove comparison"
        );
        return;
      }

      setComparisons((currentComparisons) =>
        currentComparisons.filter(
          (comparison) =>
            comparison.id !== comparisonId
        )
      );
    } catch (error) {
      console.error(
        "REMOVE_COMPARISON_ERROR:",
        error
      );

      alert("Something went wrong while removing comparison.");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 sm:py-12">
        <div className="py-20 text-center text-gray-500">
          Loading saved comparisons...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">

        {/* Heading */}
        <div className="mb-8 sm:mb-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Your Comparisons
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            Saved Comparisons
          </h1>

          <p className="mt-3 text-sm text-gray-600 sm:text-base">
            View and manage your saved college comparisons.
          </p>
        </div>

        {/* Empty State */}
        {comparisons.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center sm:p-12">
            <p className="text-lg font-semibold text-gray-900 sm:text-xl">
              No saved comparisons yet
            </p>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Compare colleges and save your comparison for later.
            </p>

            <Link
              href="/compare"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Compare Colleges
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
            {comparisons.map((comparison) => {
              const college1 = colleges.find(
                (college) =>
                  college.id === comparison.college1Id
              );

              const college2 = colleges.find(
                (college) =>
                  college.id === comparison.college2Id
              );

              return (
                <div
                  key={comparison.id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
                >
                  <p className="text-xs font-semibold tracking-wide text-blue-600 sm:text-sm">
                    COLLEGE COMPARISON
                  </p>

                  {/* First College */}
                  <div className="mt-5 rounded-xl bg-gray-50 p-4">
                    <h2 className="break-words text-base font-bold text-gray-900 sm:text-lg">
                      {college1?.name || "College not found"}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {college1?.city || "N/A"},{" "}
                      {college1?.state || "N/A"}
                    </p>
                  </div>

                  {/* VS */}
                  <div className="my-4 text-center font-bold text-blue-600">
                    VS
                  </div>

                  {/* Second College */}
                  <div className="rounded-xl bg-gray-50 p-4">
                    <h2 className="break-words text-base font-bold text-gray-900 sm:text-lg">
                      {college2?.name || "College not found"}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {college2?.city || "N/A"},{" "}
                      {college2?.state || "N/A"}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href={`/compare?college1=${comparison.college1Id}&college2=${comparison.college2Id}`}
                      className="w-full flex-1 rounded-lg bg-blue-600 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
                    >
                      Compare Again
                    </Link>

                    <button
                      onClick={() =>
                        removeComparison(comparison.id)
                      }
                      className="w-full rounded-lg border border-red-200 px-4 py-3 font-semibold text-red-600 transition hover:bg-red-50 sm:w-auto"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}