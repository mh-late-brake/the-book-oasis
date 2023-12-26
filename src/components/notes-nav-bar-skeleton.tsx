export default function NavBarSkeleton() {
  return (
    <>
      <nav className="flex w-full bg-white px-6 py-1 font-sans shadow-md">
        <div className="text-grey-darkest mx-auto mb-1 text-2xl">Notes</div>
        <select className="text-md mx-4 w-28 rounded-3xl border border-purple-700 bg-transparent text-center text-purple-700">
          <option>Recent</option>
          <option>! Recent</option>
          <option>Book &#x2191;</option>
          <option>Book &#x2193;</option>
        </select>
        <div className="flex w-1/4 items-center rounded-3xl border border-purple-700 bg-gray-50 px-4 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500">
          <svg
            className="inline h-4 w-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
          <input
            type="text"
            className="mx-2 w-full text-purple-700 focus:outline-none"
            placeholder="Search book ..."
          />
        </div>
      </nav>
    </>
  );
}
