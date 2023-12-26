"use client";
import AddBookCard from "src/components/add-book-card";
import BookCard from "src/components/book-card";
import { Book } from "@prisma/client";
import { useState } from "react";

type InputType = Omit<
  Book,
  | "numberOfPages"
  | "createdAt"
  | "startReadingAt"
  | "finishReadingAt"
  | "coverImageKey"
  | "ebookFileUrl"
  | "ebookFileKey"
  | "userId"
>[];

enum SortType {
  TitleAsc = "TitleAsc",
  TitleDesc = "TitleDesc",
  AuthorAsc = "AuthorAsc",
  AuthorDesc = "AuthorDesc",
  GenreAsc = "GenreAsc",
  GenreDesc = "GenreDesc",
  Recent = "Recent",
  OppRecent = "OppRecent",
  StatusAsc = "StatusAsc",
  StatusDesc = "StatusDesc",
  EbookAvailable = "EbookAvailable",
}

export default function LibaryPage({ bookData }: { bookData: InputType }) {
  const [searchInput, setSearchInput] = useState("");
  const [sort, setSort] = useState<SortType>(SortType.Recent);

  let bookDataAfterProcess = bookData;

  // Search

  if (searchInput !== "")
    bookDataAfterProcess = bookDataAfterProcess.filter((book) => {
      return (
        book.title.toLowerCase().includes(searchInput.toLowerCase()) ||
        book.genre?.toLowerCase().includes(searchInput.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchInput.toLowerCase()) ||
        book.status?.toLowerCase().includes(searchInput.toLowerCase())
      );
    });

  // Sort

  if (sort === SortType.TitleAsc) {
    bookDataAfterProcess.sort((a, b) => {
      if (a.title.toLowerCase() < b.title.toLowerCase()) return -1;
      if (a.title.toLowerCase() > b.title.toLowerCase()) return 1;
      return 0;
    });
  }
  if (sort === SortType.TitleDesc) {
    bookDataAfterProcess.sort((a, b) => {
      if (a.title.toLowerCase() > b.title.toLowerCase()) return -1;
      if (a.title.toLowerCase() < b.title.toLowerCase()) return 1;
      return 0;
    });
  }
  if (sort === SortType.AuthorAsc) {
    bookDataAfterProcess.sort((a, b) => {
      if (a.author === null) return 1;
      if (b.author === null) return -1;
      if (a.author.toLowerCase() < b.author.toLowerCase()) return -1;
      if (a.author.toLowerCase() > b.author.toLowerCase()) return 1;
      return 0;
    });
  }
  if (sort === SortType.AuthorDesc) {
    bookDataAfterProcess.sort((a, b) => {
      if (a.author === null) return 1;
      if (b.author === null) return -1;
      if (a.author.toLowerCase() > b.author.toLowerCase()) return -1;
      if (a.author.toLowerCase() < b.author.toLowerCase()) return 1;
      else return 0;
    });
  }
  if (sort === SortType.GenreAsc) {
    bookDataAfterProcess.sort((a, b) => {
      if (a.genre === null) return 1;
      if (b.genre === null) return -1;
      if (a.genre.toLowerCase() < b.genre.toLowerCase()) return -1;
      if (a.genre.toLowerCase() > b.genre.toLowerCase()) return 1;
      return 0;
    });
  }
  if (sort === SortType.GenreDesc) {
    bookDataAfterProcess.sort((a, b) => {
      if (a.genre === null) return 1;
      if (b.genre === null) return -1;
      if (a.genre.toLowerCase() > b.genre.toLowerCase()) return -1;
      if (a.genre.toLowerCase() < b.genre.toLowerCase()) return 1;
      else return 0;
    });
  }
  if (sort === SortType.Recent) {
    bookDataAfterProcess.sort((a, b) => {
      if (a.lastOpenAt > b.lastOpenAt) return -1;
      if (a.lastOpenAt < b.lastOpenAt) return 1;
      return 0;
    });
  }
  if (sort === SortType.OppRecent) {
    bookDataAfterProcess.sort((a, b) => {
      if (a.lastOpenAt < b.lastOpenAt) return -1;
      if (a.lastOpenAt > b.lastOpenAt) return 1;
      return 0;
    });
  }
  if (sort === SortType.StatusAsc) {
    bookDataAfterProcess.sort((a, b) => {
      if (a.status === null) return 1;
      if (b.status === null) return -1;
      if (a.status.toLowerCase() < b.status.toLowerCase()) return -1;
      if (a.status.toLowerCase() > b.status.toLowerCase()) return 1;
      else return 0;
    });
  }
  if (sort === SortType.StatusDesc) {
    bookDataAfterProcess.sort((a, b) => {
      if (a.status === null) return 1;
      if (b.status === null) return -1;
      if (a.status.toLowerCase() > b.status.toLowerCase()) return -1;
      if (a.status.toLowerCase() < b.status.toLowerCase()) return 1;
      else return 0;
    });
  }
  if (sort === SortType.EbookAvailable) {
    bookDataAfterProcess.sort((a, b) => {
      if (!!a.ebookFileName && !b.ebookFileName) return -1;
      if (!a.ebookFileName && !!b.ebookFileName) return 1;
      return 0;
    });
  }

  return (
    <>
      <NavBar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        sort={sort}
        setSort={setSort}
      />
      <div className="grid w-full grid-cols-4 gap-7 p-4">
        <AddBookCard />
        {bookDataAfterProcess.map((book) => (
          <BookCard
            id={book.id}
            key={book.id}
            coverImageUrl={book.coverImageUrl}
            title={book.title}
            author={book.author}
            genre={book.genre}
            rating={book.rating}
            status={book.status}
            ebookFileName={book.ebookFileName}
          />
        ))}
      </div>
    </>
  );
}

const NavBar = ({
  searchInput,
  setSearchInput,
  sort,
  setSort,
}: {
  searchInput: string;
  setSearchInput: (arg0: string) => void;
  sort: SortType;
  setSort: (arg0: SortType) => void;
}) => {
  return (
    <>
      <nav className="flex w-full bg-white px-6 py-1 font-sans shadow-md">
        <div className="text-grey-darkest mx-auto mb-1 text-2xl">Library</div>
        <select
          className="text-md mx-4 w-28 rounded-3xl border border-purple-700 bg-transparent text-center text-purple-700"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortType)}
        >
          <option value={SortType.Recent}>Recent</option>
          <option value={SortType.OppRecent}>! Recent</option>
          <option value={SortType.EbookAvailable}>Ebook</option>
          <option value={SortType.TitleAsc}>Title &#x2191;</option>
          <option value={SortType.TitleDesc}>Title &#x2193;</option>
          <option value={SortType.AuthorAsc}>Author &#x2191;</option>
          <option value={SortType.AuthorDesc}>Author &#x2193;</option>
          <option value={SortType.GenreAsc}>Genre &#x2191;</option>
          <option value={SortType.GenreDesc}>Genre &#x2193;</option>
          <option value={SortType.StatusAsc}>Status &#x2191;</option>
          <option value={SortType.StatusDesc}>Status &#x2193;</option>
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
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </nav>
    </>
  );
};
