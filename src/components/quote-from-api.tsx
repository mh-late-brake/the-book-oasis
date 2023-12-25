"use client";
import useSWR from "swr";

const apiEndPoint = "https://api.quotable.io/quotes/random";
const fetcher = (args: string) => fetch(args).then((res) => res.json());

export default function QuoteFromAPI() {
  const { data, error, isLoading, mutate } = useSWR(apiEndPoint, fetcher, {
    revalidateOnFocus: false,
  });

  let content;
  if (error) content = "Error while fetching quote from API";
  else if (isLoading) content = "Fetching quote from API ...";
  else content = `"${data[0].content}"`;

  const author = !error && !isLoading && `-- ${data[0].author} --`;

  return (
    <div className="rounded-2xl border border-gray-100 p-2 pl-3 shadow-lg">
      <blockquote className="text-gray-900:text-white text-xl italic">
        <svg
          className="mb-4 h-8 w-8 text-gray-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 18 14"
        >
          <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
        </svg>
        <p>{content}</p>
        <p className="text-center">{author}</p>
        <div className="flex items-center justify-end px-5">
          <svg
            className="mt-4 h-8 w-8 text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 14"
          >
            <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
          </svg>
        </div>
      </blockquote>
      <div className="flex w-full items-center justify-center">
        <button
          type="button"
          className="mb-2 me-2 rounded-lg bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-purple-300"
          onClick={() => mutate()}
        >
          New Quote
        </button>
      </div>
    </div>
  );
}
