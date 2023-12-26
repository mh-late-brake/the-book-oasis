"use client";
import { useState } from "react";
import CreateNote from "src/components/create-note";
import Notes from "src/components/notes";

enum SortType {
  Recent = "Recent",
  OppRecent = "OppRecent",
  BookAsc = "BookAsc",
  BookDesc = "BookDesc",
}

export default function NotesPage({
  listOfOwner,
  listOfNote,
}: {
  listOfOwner: Array<{
    id: number;
    name: string;
  }>;
  listOfNote: Array<{
    noteId: number;
    noteTitle: string;
    noteContent: string | null;
    ownerId: number;
    ownerName: string;
    lastModifiedAt: Date;
  }>;
}) {
  const [searchInput, setSearchInput] = useState("");
  const [sort, setSort] = useState(SortType.Recent);

  let listOfNoteAfterProcess = listOfNote;

  // Search

  if (searchInput !== "") {
    listOfNoteAfterProcess = listOfNoteAfterProcess.filter((note) => {
      return (
        note.noteTitle.toLowerCase().includes(searchInput.toLowerCase()) ||
        note.noteContent?.toLowerCase().includes(searchInput.toLowerCase()) ||
        note.ownerName.toLowerCase().includes(searchInput.toLowerCase())
      );
    });
  }

  // Sort

  if (sort === SortType.Recent) {
    listOfNoteAfterProcess.sort((a, b) => {
      if (a.lastModifiedAt > b.lastModifiedAt) return -1;
      if (a.lastModifiedAt < b.lastModifiedAt) return 1;
      return 0;
    });
  }
  if (sort === SortType.OppRecent) {
    listOfNoteAfterProcess.sort((a, b) => {
      if (a.lastModifiedAt < b.lastModifiedAt) return -1;
      if (a.lastModifiedAt > b.lastModifiedAt) return 1;
      return 0;
    });
  }
  if (sort === SortType.BookAsc) {
    listOfNoteAfterProcess.sort((a, b) => {
      if (a.ownerName.toLowerCase() < b.ownerName.toLowerCase()) return -1;
      if (a.ownerName.toLowerCase() > b.ownerName.toLowerCase()) return 1;
      return 0;
    });
  }
  if (sort === SortType.BookDesc) {
    listOfNoteAfterProcess.sort((a, b) => {
      if (a.ownerName.toLowerCase() > b.ownerName.toLowerCase()) return -1;
      if (a.ownerName.toLowerCase() < b.ownerName.toLowerCase()) return 1;
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
      <div className="grid grid-cols-5 gap-7 p-5">
        <CreateNote defaultOwnerId={-1} listOfOwner={listOfOwner} />
        <Notes
          listOfNote={listOfNoteAfterProcess}
          listOfOwner={listOfOwner.map((owner) => ({
            ownerId: owner.id,
            ownerName: owner.name,
          }))}
        />
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
        <div className="text-grey-darkest mx-auto mb-1 text-2xl">Notes</div>
        <select
          className="text-md mx-4 w-28 rounded-3xl border border-purple-700 bg-transparent text-center text-purple-700"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortType)}
        >
          <option value={SortType.Recent}>Recent</option>
          <option value={SortType.OppRecent}>! Recent</option>
          <option value={SortType.BookAsc}>Book &#x2191;</option>
          <option value={SortType.BookDesc}>Book &#x2193;</option>
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
