import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-blue-50 to-white">
      <section className="mx-auto flex max-w-7xl flex-col items-center px-4 py-12 text-center sm:px-6 sm:py-16 lg:px-8 lg:py-28">
        {/* Badge */}
        <span className="mb-5 rounded-full bg-blue-100 px-4 py-2 text-xs font-medium text-blue-700 sm:mb-6 sm:text-sm">
          Find the right college for your future
        </span>

        {/* Heading */}
        <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
          Discover colleges.
          <span className="text-blue-600"> Compare smarter.</span>
          <br />
          Decide with confidence.
        </h1>

        {/* Description */}
        <p className="mt-5 max-w-2xl text-sm leading-6 text-gray-600 sm:mt-6 sm:text-lg sm:leading-7">
          Search and compare colleges based on fees, ratings, placements and
          location. Save your favourites and make better education decisions.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
          <Link
            href="/colleges"
            className="w-full rounded-lg bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
          >
            Explore Colleges
          </Link>

          <Link
            href="/compare"
            className="w-full rounded-lg border border-gray-300 bg-white px-6 py-3 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50 sm:w-auto"
          >
            Compare Colleges
          </Link>

          <Link
            href="/predictor"
            className="w-full rounded-lg bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
          >
            Predict Your College on Your JEE Rank
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-12 grid w-full max-w-4xl gap-4 sm:mt-16 sm:grid-cols-3 sm:gap-6">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900">100+</h2>

            <p className="mt-2 text-sm text-gray-600">
              Colleges to explore
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900">4</h2>

            <p className="mt-2 text-sm text-gray-600">
              Smart filter options
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900">
              1 Place
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              To compare your choices
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}