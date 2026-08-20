import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

interface CollegeDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CollegeDetailsPage({
  params,
}: CollegeDetailsPageProps) {
  const { id } = await params;

  const college = await prisma.college.findUnique({
    where: {
      id,
    },
    include: {
      courses: true,
      placements: true,
      ratings: true,
    },
  });

  if (!college) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-6xl">

        {/* Back Button */}
        <a
          href="/colleges"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-800 hover:underline sm:mb-6 sm:text-base"
        >
          ← Back to Colleges
        </a>

        {/* College Header */}
        <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            
            <div className="min-w-0">
              <span className="inline-block rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700 sm:px-4 sm:py-2 sm:text-sm">
                {college.collegeType}
              </span>

              <h1 className="mt-4 break-words text-2xl font-bold leading-tight text-gray-900 sm:mt-5 sm:text-3xl md:text-4xl">
                {college.name}
              </h1>

              <p className="mt-3 text-sm text-gray-600 sm:text-base md:text-lg">
                📍 {college.city}, {college.state}, {college.country}
              </p>

              {college.establishedYear && (
                <p className="mt-2 text-sm text-gray-600 sm:text-base">
                  Established: {college.establishedYear}
                </p>
              )}
            </div>

            {college.ratings && (
              <div className="w-full rounded-xl bg-yellow-50 p-4 text-center sm:w-auto sm:min-w-40 sm:p-5">
                <p className="text-sm text-gray-600">
                  Overall Rating
                </p>

                <p className="mt-1 text-3xl font-bold text-yellow-600 sm:text-4xl">
                  ⭐ {college.ratings.overall ?? "N/A"}
                </p>
              </div>
            )}
          </div>

          {college.description && (
            <p className="mt-6 text-sm leading-6 text-gray-700 sm:text-base sm:leading-7">
              {college.description}
            </p>
          )}

          {college.website && (
            <a
              href={college.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center rounded-lg bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-100 sm:text-base"
            >
              Visit Official Website →
            </a>
          )}
        </div>

        {/* Placement Section */}
        {college.placements && (
          <section className="mt-8">
            <h2 className="mb-4 text-xl font-bold text-gray-900 sm:text-2xl">
              Placement Statistics
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
              <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
                <p className="text-sm text-gray-500">
                  Average Package
                </p>

                <h3 className="mt-2 break-words text-xl font-bold text-blue-600 sm:text-2xl">
                  {college.placements.averagePackage !== null
                    ? `₹${college.placements.averagePackage} LPA`
                    : "N/A"}
                </h3>
              </div>

              <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
                <p className="text-sm text-gray-500">
                  Highest Package
                </p>

                <h3 className="mt-2 break-words text-xl font-bold text-green-600 sm:text-2xl">
                  {college.placements.highestPackage !== null
                    ? `₹${college.placements.highestPackage} LPA`
                    : "N/A"}
                </h3>
              </div>

              <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6 sm:col-span-2 lg:col-span-1">
                <p className="text-sm text-gray-500">
                  Placement Percentage
                </p>

                <h3 className="mt-2 text-xl font-bold text-purple-600 sm:text-2xl">
                  {college.placements.placementPercent !== null
                    ? `${college.placements.placementPercent}%`
                    : "N/A"}
                </h3>
              </div>
            </div>
          </section>
        )}

        {/* Courses Section */}
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-bold text-gray-900 sm:text-2xl">
            Available Courses
          </h2>

          {college.courses.length === 0 ? (
            <div className="rounded-xl bg-white p-6 text-center text-gray-500 shadow-sm">
              No courses available.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 md:gap-5">
              {college.courses.map((course) => (
                <div
                  key={course.id}
                  className="rounded-xl bg-white p-5 shadow-sm sm:p-6"
                >
                  <h3 className="break-words text-lg font-bold text-gray-900 sm:text-xl">
                    {course.name}
                  </h3>

                  <div className="mt-4 space-y-2 text-sm text-gray-600 sm:text-base">
                    <p>
                      <span className="font-medium text-gray-800">
                        Degree:
                      </span>{" "}
                      {course.degree ?? "N/A"}
                    </p>

                    <p>
                      <span className="font-medium text-gray-800">
                        Duration:
                      </span>{" "}
                      {course.duration ?? "N/A"}
                    </p>

                    <p>
                      <span className="font-medium text-gray-800">
                        Fees:
                      </span>{" "}
                      {course.fees !== null
                        ? `₹${course.fees.toLocaleString()}`
                        : "N/A"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Ratings Section */}
        {college.ratings && (
          <section className="mt-8">
            <h2 className="mb-4 text-xl font-bold text-gray-900 sm:text-2xl">
              Detailed Ratings
            </h2>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
              <RatingCard
                title="Academics"
                rating={college.ratings.academics}
              />

              <RatingCard
                title="Infrastructure"
                rating={college.ratings.infrastructure}
              />

              <RatingCard
                title="Placements"
                rating={college.ratings.placements}
              />

              <RatingCard
                title="Campus Life"
                rating={college.ratings.campusLife}
              />
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function RatingCard({
  title,
  rating,
}: {
  title: string;
  rating: number | null;
}) {
  return (
    <div className="rounded-xl bg-white p-4 text-center shadow-sm sm:p-5">
      <p className="text-sm text-gray-500 sm:text-base">
        {title}
      </p>

      <p className="mt-2 text-lg font-bold text-yellow-500 sm:text-2xl">
        ⭐ {rating ?? "N/A"}
      </p>
    </div>
  );
}