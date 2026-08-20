"use client";

import { useEffect, useState } from "react";
import CollegeCard from "./CollegeCard";

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

const COLLEGES_PER_PAGE = 6;

export default function CollegeList() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [collegeType, setCollegeType] = useState("");
  const [maxFee, setMaxFee] = useState("");
  const [minRating, setMinRating] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchColleges() {
      try {
        const response = await fetch("/api/colleges");
        const result = await response.json();

        if (result.success) {
          setColleges(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch colleges:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchColleges();
  }, []);

  const filteredColleges = colleges.filter((college) => {
    const searchTerm = search.toLowerCase();

    const matchesSearch =
      college.name.toLowerCase().includes(searchTerm) ||
      college.city.toLowerCase().includes(searchTerm) ||
      college.state.toLowerCase().includes(searchTerm);

    const matchesType =
      collegeType === "" || college.collegeType === collegeType;

    const matchesFee =
      maxFee === "" ||
      college.courses.some(
        (course) =>
          course.fees !== null &&
          course.fees <= Number(maxFee)
      );

    const matchesRating =
      minRating === "" ||
      (college.ratings?.overall ?? 0) >= Number(minRating);

    return (
      matchesSearch &&
      matchesType &&
      matchesFee &&
      matchesRating
    );
  });

  // =========================
  // Pagination
  // =========================

  const totalPages = Math.ceil(
    filteredColleges.length / COLLEGES_PER_PAGE
  );

  const startIndex =
    (currentPage - 1) * COLLEGES_PER_PAGE;

  const paginatedColleges = filteredColleges.slice(
    startIndex,
    startIndex + COLLEGES_PER_PAGE
  );

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setCollegeType("");
    setMaxFee("");
    setMinRating("");
    setCurrentPage(1);
  };

  // Search/filter change hone par Page 1 par reset
  useEffect(() => {
    setCurrentPage(1);
  }, [search, collegeType, maxFee, minRating]);

  const collegeTypes = Array.from(
    new Set(colleges.map((college) => college.collegeType))
  );

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500">
        Loading colleges...
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Heading */}
      <div className="mb-8 text-center sm:mb-10">
        <p className="text-sm font-semibold text-blue-600">
          EXPLORE COLLEGES
        </p>

        <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
          Find Your Perfect College
        </h1>

        <p className="mt-3 text-sm text-gray-500 sm:text-base">
          Explore and compare top colleges across India.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <input
            type="text"
            placeholder="Search college or location..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
          />

          <select
            value={collegeType}
            onChange={(event) =>
              setCollegeType(event.target.value)
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
          >
            <option value="">All College Types</option>

            {collegeTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            value={maxFee}
            onChange={(event) => setMaxFee(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
          >
            <option value="">Any Maximum Fee</option>
            <option value="100000">Up to ₹1 Lakh</option>
            <option value="200000">Up to ₹2 Lakh</option>
            <option value="300000">Up to ₹3 Lakh</option>
            <option value="500000">Up to ₹5 Lakh</option>
            <option value="1000000">Up to ₹10 Lakh</option>
          </select>

          <select
            value={minRating}
            onChange={(event) =>
              setMinRating(event.target.value)
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
          >
            <option value="">Any Rating</option>
            <option value="4">4.0+ Rating</option>
            <option value="4.5">4.5+ Rating</option>
            <option value="4.7">4.7+ Rating</option>
          </select>

          <button
            onClick={clearFilters}
            className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-600 sm:text-base">
          Showing{" "}
          <span className="font-semibold text-gray-900">
            {paginatedColleges.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900">
            {filteredColleges.length}
          </span>{" "}
          colleges
        </p>

        {totalPages > 1 && (
          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </p>
        )}
      </div>

      {/* College Cards */}
      {filteredColleges.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center">
          <p className="text-lg font-semibold text-gray-900">
            No colleges found
          </p>

          <p className="mt-2 text-gray-500">
            Try changing your search or filter options.
          </p>

          <button
            onClick={clearFilters}
            className="mt-5 rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedColleges.map((college) => (
              <CollegeCard
                key={college.id}
                college={college}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-10 w-10 rounded-lg text-sm font-semibold transition ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}