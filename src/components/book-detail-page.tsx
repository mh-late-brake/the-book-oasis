"use client";

import Link from "next/link";
import BookCoverForm from "./book-cover-form";
import BookDetailForm from "src/components/book-detail-form";
import CreateNote from "src/components/create-note";
import Notes from "src/components/notes";
import { Book } from "@prisma/client";
import { useRef } from "react";
import EbookForm from "./ebook-form";

export default function BookDetailPage({
  book,
  listOfNote,
  listOfOwner,
}: {
  book: Book;
  listOfNote: Array<{
    noteId: number;
    noteTitle: string;
    noteContent: string | null;
    ownerId: number;
    ownerName: string;
  }>;
  listOfOwner: Array<{
    id: number;
    title: string;
  }>;
}) {
  const notesRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <div className="m-auto flex h-screen w-full flex-col items-center justify-between">
        <div className="flex h-5/6 w-5/6 items-center">
          <div className="flex basis-1/3 flex-col items-center justify-between pt-12">
            <BookCoverForm id={book.id} imageUrl={book.coverImageUrl} />
            <EbookForm id={book.id} ebookFileName={book.ebookFileName} />
          </div>
          <div className="basis-2/3">
            <BookDetailForm
              id={book.id}
              title={book.title}
              author={book.author}
              genre={book.genre}
              numberOfPages={book.numberOfPages}
              status={book.status}
              rating={book.rating}
              startReadingAt={book.startReadingAt}
              finishReadingAt={book.finishReadingAt}
            />
          </div>
        </div>
        <div className="flex flex-row items-center">
          {book.ebookFileName && (
            <Link href={`/library/read/${book.id}`}>
              <button
                type="button"
                className="me-2 mr-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-l focus:outline-none focus:ring-4 focus:ring-purple-200"
              >
                Read Ebook
              </button>
            </Link>
          )}
          <button
            type="button"
            className="inline-flex items-center rounded-lg bg-purple-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300"
            onClick={() =>
              notesRef.current &&
              notesRef.current.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            Notes
            <svg
              className="ms-2 h-3.5 w-3.5 rotate-90 transform"
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
          </button>
        </div>
        <div className="h-11"></div>
      </div>
      <div ref={notesRef} className="grid grid-cols-5 gap-7 p-5">
        <CreateNote
          defaultOwnerId={book.id}
          listOfOwner={listOfOwner.map((owner) => ({
            id: owner.id,
            name: owner.title,
          }))}
        />
        <Notes
          listOfNote={listOfNote}
          listOfOwner={listOfOwner.map((owner) => ({
            ownerId: owner.id,
            ownerName: owner.title,
          }))}
        />
      </div>
    </>
  );
}
