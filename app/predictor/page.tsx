"use client";

import { useState } from "react";

type CollegeResult = {
  college: {
    id: string;
    name: string;
    city: string;
    state: string;
  };
  course: {
    name: string;
    fees: number | null;
  } | null;
  openingRank: number | null;
  closingRank: number;
};

export default function PredictorPage() {
  const [exam, setExam] = useState("JEE Main");
  const [rank, setRank] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CollegeResult[]>([]);
  const [message, setMessage] = useState("");

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rank || Number(rank) <= 0) {
      setMessage("Please enter a valid rank.");
      return;
    }

    setLoading(true);
    setMessage("");
    setResults([]);

    try {
      const response = await fetch(
        `/api/predictor?exam=${encodeURIComponent(
          exam
        )}&rank=${rank}`
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Something went wrong.");
        return;
      }

      if (data.length === 0) {
        setMessage(
          "No colleges found for this rank in our current dataset."
        );
      } else {
        setResults(data);
      }
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
      <div className="mx-auto max-w-5xl">

        {/* Heading */}
        <div className="mb-8 text-center sm:mb-10">
          <p className="text-sm font-semibold text-blue-600">
            COLLEGE PREDICTOR
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            College Rank Predictor
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
            Enter your exam and rank to find colleges you may be eligible for.
          </p>
        </div>

        {/* Prediction Form */}
        <form
          onSubmit={handlePredict}
          className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6"
        >
          <div className="grid gap-5 md:grid-cols-3">

            {/* Exam */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Exam
              </label>

              <select
                value={exam}
                onChange={(e) => setExam(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
              >
                <option>JEE Main</option>
                <option>JEE Advanced</option>
              </select>
            </div>

            {/* Rank */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Your Rank
              </label>

              <input
                type="number"
                min="1"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                placeholder="Enter your rank"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            {/* Button */}
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Predicting..." : "Predict Colleges"}
              </button>
            </div>
          </div>
        </form>

        {/* Message */}
        {message && (
          <div className="mt-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-center text-sm text-yellow-700">
            {message}
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <section className="mt-8 sm:mt-10">
            <div className="mb-6 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-900">
                Recommended Colleges
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Found {results.length} possible college recommendations.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 sm:gap-6">
              {results.map((item, index) => (
                <div
                  key={`${item.college.id}-${index}`}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
                >
                  {/* Number */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold tracking-wide text-blue-600">
                        RECOMMENDATION {index + 1}
                      </p>

                      <h3 className="mt-2 text-lg font-bold text-gray-900 sm:text-xl">
                        {item.college.name}
                      </h3>
                    </div>

                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                      Match
                    </span>
                  </div>

                  {/* Location */}
                  <p className="mt-3 text-sm text-gray-600">
                    📍 {item.college.city}, {item.college.state}
                  </p>

                  {item.course && (
                    <div className="mt-5 space-y-4 border-t border-gray-100 pt-5">

                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          COURSE
                        </p>

                        <p className="mt-1 font-semibold text-gray-900">
                          {item.course.name}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">

                        <div>
                          <p className="text-xs font-medium text-gray-500">
                            FEES
                          </p>

                          <p className="mt-1 font-semibold text-gray-900">
                            {item.course.fees
                              ? `₹${item.course.fees.toLocaleString()}`
                              : "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-gray-500">
                            CLOSING RANK
                          </p>

                          <p className="mt-1 font-semibold text-gray-900">
                            {item.closingRank.toLocaleString()}
                          </p>
                        </div>

                      </div>

                      <div className="rounded-lg bg-gray-50 p-3">
                        <p className="text-xs font-medium text-gray-500">
                          CUTOFF RANGE
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-900">
                          {item.openingRank?.toLocaleString() ?? "N/A"} -{" "}
                          {item.closingRank.toLocaleString()}
                        </p>
                      </div>

                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}