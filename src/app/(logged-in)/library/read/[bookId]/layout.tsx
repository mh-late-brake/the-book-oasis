import Link from "next/link";

export default function Layout({
  params,
  children,
}: {
  params: { bookId: string };
  children: React.ReactNode;
}) {
  return (
    <>
      <nav className="grid grid-cols-3 bg-white px-6 py-1 font-sans shadow-md">
        <Link
          href={"/library/book/" + params.bookId}
          className="inline-flex items-center justify-self-start font-medium text-blue-600 hover:underline"
        >
          <svg
            className="mr-2 h-4 w-4 scale-x-[-1] rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
          Back to book
        </Link>

        <div className="text-grey-darkest mx-auto mb-1 text-2xl">Read</div>
      </nav>
      <div className="">{children}</div>
    </>
  );
}
