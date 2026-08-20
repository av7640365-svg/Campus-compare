"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {Suspense} from "react";

type College = {
  id: string;
  name: string;
  city: string;
  state: string;
  collegeType: string;
  establishedYear: number | null;

  placements: {
    averagePackage: number | null;
    highestPackage: number | null;
    placementPercent: number | null;
  } | null;

  ratings: {
    overall: number | null;
  } | null;

  courses: {
    id: string;
    name: string;
    degree: string | null;
    fees: number | null;
  }[];
};

 function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [colleges, setColleges] = useState<College[]>([]);

  const [college1, setCollege1] = useState(
    searchParams.get("college1") || ""
  );

  const [college2, setCollege2] = useState(
    searchParams.get("college2") || ""
  );

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchColleges() {
      try {
        const response = await fetch("/api/colleges");
        const result = await response.json();

        if (result.success) {
          setColleges(result.data);
        }
      } catch (error) {
        console.error("FETCH_COLLEGES_ERROR:", error);
      }
    }

    fetchColleges();
  }, []);

  const selectedCollege1 = colleges.find(
    (college) => college.id === college1
  );

  const selectedCollege2 = colleges.find(
    (college) => college.id === college2
  );

  const handleSaveComparison = async () => {
    if (!selectedCollege1 || !selectedCollege2) {
      setMessage("Please select two colleges first.");
      return;
    }

    const userData = localStorage.getItem("user");

    if (!userData) {
      alert("Please login first to save comparison.");
      router.push("/login");
      return;
    }

    const user = JSON.parse(userData);

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/saved-comparisons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          college1Id: selectedCollege1.id,
          college2Id: selectedCollege2.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "Failed to save comparison");
        return;
      }

      setMessage("Comparison saved successfully!");
    } catch (error) {
      console.error("SAVE_COMPARISON_ERROR:", error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <div className="text-center">
          <p className="text-sm font-semibold text-blue-600">
            COLLEGE COMPARISON
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            Compare Colleges
          </h1>

          <p className="mt-3 text-sm text-gray-600 sm:text-base">
            Select two colleges and compare them side by side.
          </p>
        </div>

        {/* Select Colleges */}
        <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-6 md:grid-cols-2">
          <select
            value={college1}
            onChange={(e) => setCollege1(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white p-4 text-sm text-gray-700 outline-none focus:border-blue-500 sm:text-base"
          >
            <option value="">Select First College</option>

            {colleges.map((college) => (
              <option key={college.id} value={college.id}>
                {college.name}
              </option>
            ))}
          </select>

          <select
            value={college2}
            onChange={(e) => setCollege2(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white p-4 text-sm text-gray-700 outline-none focus:border-blue-500 sm:text-base"
          >
            <option value="">Select Second College</option>

            {colleges.map((college) => (
              <option key={college.id} value={college.id}>
                {college.name}
              </option>
            ))}
          </select>
        </div>

        {/* Comparison Table */}
        {selectedCollege1 && selectedCollege2 && (
          <div className="mt-8 overflow-x-auto pb-2 sm:mt-10">
            <div className="min-w-[700px] overflow-hidden rounded-2xl bg-white shadow-sm">
              {/* Table Header */}
              <div className="grid grid-cols-3 bg-blue-600 p-5 text-white">
                <div className="font-semibold">Feature</div>

                <div className="text-center font-semibold">
                  {selectedCollege1.name}
                </div>

                <div className="text-center font-semibold">
                  {selectedCollege2.name}
                </div>
              </div>

              <ComparisonRow
                title="Location"
                value1={`${selectedCollege1.city}, ${selectedCollege1.state}`}
                value2={`${selectedCollege2.city}, ${selectedCollege2.state}`}
              />

              <ComparisonRow
                title="College Type"
                value1={selectedCollege1.collegeType}
                value2={selectedCollege2.collegeType}
              />

              <ComparisonRow
                title="Established"
                value1={selectedCollege1.establishedYear ?? "N/A"}
                value2={selectedCollege2.establishedYear ?? "N/A"}
              />

              <ComparisonRow
                title="Course Fees"
                value1={
                  selectedCollege1.courses[0]?.fees
                    ? `₹${(
                        selectedCollege1.courses[0].fees / 100000
                      ).toFixed(2)} Lakh`
                    : "N/A"
                }
                value2={
                  selectedCollege2.courses[0]?.fees
                    ? `₹${(
                        selectedCollege2.courses[0].fees / 100000
                      ).toFixed(2)} Lakh`
                    : "N/A"
                }
              />

              <ComparisonRow
                title="Overall Rating"
                value1={selectedCollege1.ratings?.overall ?? "N/A"}
                value2={selectedCollege2.ratings?.overall ?? "N/A"}
              />

              <ComparisonRow
                title="Average Package"
                value1={
                  selectedCollege1.placements?.averagePackage
                    ? `₹${selectedCollege1.placements.averagePackage} LPA`
                    : "N/A"
                }
                value2={
                  selectedCollege2.placements?.averagePackage
                    ? `₹${selectedCollege2.placements.averagePackage} LPA`
                    : "N/A"
                }
              />

              <ComparisonRow
                title="Highest Package"
                value1={
                  selectedCollege1.placements?.highestPackage
                    ? `₹${selectedCollege1.placements.highestPackage} LPA`
                    : "N/A"
                }
                value2={
                  selectedCollege2.placements?.highestPackage
                    ? `₹${selectedCollege2.placements.highestPackage} LPA`
                    : "N/A"
                }
              />

              <ComparisonRow
                title="Placement Percentage"
                value1={
                  selectedCollege1.placements?.placementPercent
                    ? `${selectedCollege1.placements.placementPercent}%`
                    : "N/A"
                }
                value2={
                  selectedCollege2.placements?.placementPercent
                    ? `${selectedCollege2.placements.placementPercent}%`
                    : "N/A"
                }
              />

              <ComparisonRow
                title="Courses Available"
                value1={selectedCollege1.courses.length}
                value2={selectedCollege2.courses.length}
              />

              {/* Save Button */}
              <div className="border-t border-gray-200 p-4 text-center sm:p-5">
                {message && (
                  <p className="mb-4 font-medium text-gray-700">
                    {message}
                  </p>
                )}

                <button
                  onClick={handleSaveComparison}
                  disabled={saving}
                  className="w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60 sm:w-auto sm:text-base"
                >
                  {saving ? "Saving..." : "💾 Save Comparison"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function ComparisonRow({
  title,
  value1,
  value2,
}: {
  title: string;
  value1: string | number;
  value2: string | number;
}) {
  return (
    <div className="grid grid-cols-3 border-t border-gray-200 p-4 sm:p-5">
      <div className="text-sm font-semibold text-gray-700 sm:text-base">
        {title}
      </div>

      <div className="break-words px-2 text-center text-sm text-gray-600 sm:text-base">
        {value1}
      </div>

      <div className="break-words px-2 text-center text-sm text-gray-600 sm:text-base">
        {value2}
      </div>
    </div>
  );
}

export default function ComparePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CompareContent />
        </Suspense>
    );
}