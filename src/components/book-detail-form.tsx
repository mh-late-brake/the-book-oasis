"use client";

import { Book } from "@prisma/client";
import { useState } from "react";
import { useFormState } from "react-dom";
import { updateBook } from "src/action/update-book";
import {
  DeleteBookButton,
  DiscardButton,
  UpdateBookButton,
} from "src/components/book-detail-form-button";

export default function BookDetailForm({
  id,
  title,
  author,
  genre,
  numberOfPages,
  status,
  rating,
  startReadingAt,
  finishReadingAt,
}: Omit<
  Book,
  | "createdAt"
  | "ebookFileUrl"
  | "ebookFileKey"
  | "userId"
  | "coverImageUrl"
  | "coverImageKey"
  | "lastOpenAt"
>) {
  const [formState, formAction] = useFormState(updateBook, null);

  const initialBookData = {
    title,
    author,
    genre,
    numberOfPages: numberOfPages ? String(numberOfPages) : "",
    status: status || "",
    rating,
    startReadingAt,
    finishReadingAt,
  };
  const [bookData, setBookData] = useState(initialBookData);

  const shallowCompareObjects = <T extends Record<string, any>>(
    obj1: T,
    obj2: T,
  ): boolean => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let key of keys1) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }

    return true;
  };

  const editing = !shallowCompareObjects(bookData, initialBookData);

  const onChangeTitle = (e: React.FormEvent<HTMLInputElement>) =>
    setBookData({
      ...bookData,
      title: e.currentTarget.value,
    });

  const onChangeAuthor = (e: React.FormEvent<HTMLInputElement>) =>
    setBookData({
      ...bookData,
      author: e.currentTarget.value,
    });

  const onChangeGenre = (e: React.FormEvent<HTMLInputElement>) =>
    setBookData({
      ...bookData,
      genre: e.currentTarget.value,
    });

  const onChangeNumberOfPages = (e: React.FormEvent<HTMLInputElement>) =>
    setBookData({
      ...bookData,
      numberOfPages: e.currentTarget.value,
    });

  const onChangeStatus = (e: any) => {
    if (e.currentTarget.value === "Reading")
      setBookData({
        ...bookData,
        status: e.currentTarget.value,
        startReadingAt: new Date(),
        finishReadingAt: null,
      });
    else if (e.currentTarget.value === "Read")
      setBookData({
        ...bookData,
        status: e.currentTarget.value,
        finishReadingAt: new Date(),
      });
    else if (e.currentTarget.value === "ToRead")
      setBookData({
        ...bookData,
        status: e.currentTarget.value,
        startReadingAt: null,
        finishReadingAt: null,
      });
    else if (e.currentTarget.value === "Paused")
      setBookData({
        ...bookData,
        status: e.currentTarget.value,
        finishReadingAt: null,
      });
    else if (e.currentTarget.value === "Abandoned")
      setBookData({
        ...bookData,
        status: e.currentTarget.value,
        finishReadingAt: null,
      });
    else
      setBookData({
        ...bookData,
        status: e.currentTarget.value,
      });
  };

  const onChangeRating = (e: any) =>
    setBookData({
      ...bookData,
      rating: e.currentTarget.value,
    });

  const handleDiscard = () => {
    setBookData(initialBookData);
  };

  return (
    <>
      <form className="mx-auto my-auto max-w-lg" action={formAction}>
        <input name="id" type="hidden" value={id} />
        <div className="group relative z-0 mb-5 w-full">
          <input
            type="text"
            name="title"
            id="title"
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
            placeholder=" "
            required
            value={bookData.title}
            onChange={onChangeTitle}
          />
          <label
            htmlFor="title"
            className="transhtmlForm absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
          >
            Book Title <span className="italic">(required)</span>
          </label>
        </div>
        <div className="group relative z-0 mb-5 w-full">
          <input
            type="text"
            name="author"
            id="author"
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
            placeholder=" "
            value={bookData.author || ""}
            onChange={onChangeAuthor}
          />
          <label
            htmlFor="author"
            className="transhtmlForm absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
          >
            Author
          </label>
        </div>
        <div className="group relative z-0 mb-5 w-full">
          <input
            type="text"
            name="genre"
            id="genre"
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
            placeholder=" "
            value={bookData.genre || ""}
            onChange={onChangeGenre}
          />
          <label
            htmlFor="genre"
            className="transhtmlForm absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
          >
            Genre
          </label>
        </div>
        <div className="group relative z-0 mb-5 w-full">
          <input
            type="text"
            name="numberOfPages"
            id="numberOfPages"
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
            placeholder=" "
            value={bookData.numberOfPages}
            onChange={onChangeNumberOfPages}
          />
          <label
            htmlFor="numberOfPages"
            className="transhtmlForm absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
          >
            Number Of Pages
          </label>
          {formState?.error &&
            typeof formState.error !== "string" &&
            formState.error.numberOfPages &&
            formState.error.numberOfPages.map((error, i) => (
              <p key={i} className="text-right text-sm italic text-red-500">
                {error}
              </p>
            ))}
        </div>
        <div className="group relative z-0 mb-5 w-full">
          <select
            name="status"
            id="status"
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
            onChange={onChangeStatus}
            value={bookData.status || "---"}
          >
            <option value="ToRead">To Read</option>
            <option value="Reading">Reading</option>
            <option value="Read">Read</option>
            <option value="Paused">Paused</option>
            <option value="Abandoned">Abandoned</option>
          </select>
          <label
            htmlFor="status"
            className="transhtmlForm absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
          >
            Book Status
          </label>
        </div>
        <div className="group relative z-0 mb-5 w-full">
          <select
            name="rating"
            id="rating"
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
            onChange={onChangeRating}
            value={bookData.rating || ""}
          >
            <option value="">---</option>
            <option value="Star1">1 Star</option>
            <option value="Star2">2 Stars</option>
            <option value="Star3">3 Stars</option>
            <option value="Star4">4 Stars</option>
            <option value="Star5">5 Stars</option>
          </select>
          <label
            htmlFor="status"
            className="transhtmlForm absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
          >
            Book Rating
          </label>
        </div>
        <div className="group relative z-0 mb-5 w-full">
          <input
            type="text"
            name="startReadingAt"
            id="startReadingAt"
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
            placeholder=" "
            disabled
            value={(bookData.startReadingAt as any) || "---"}
          />
          <label
            htmlFor="startReadingAt"
            className="transhtmlForm absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
          >
            Start Reading At (auto generated based on status)
          </label>
        </div>
        <div className="group relative z-0 mb-5 w-full">
          <input
            type="text"
            name="finishReadingAt"
            id="numberOfPages"
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
            placeholder=" "
            disabled
            value={(bookData.finishReadingAt as any) || "---"}
          />
          <label
            htmlFor="finishReadingAt"
            className="transhtmlForm absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
          >
            Finish Reading At (auto generated based on status)
          </label>
        </div>
        {editing && <UpdateBookButton />}
        {editing && <DiscardButton onButtonClick={handleDiscard} />}
        {!editing && <DeleteBookButton />}
        {formState?.message && (
          <p className="mt-3 italic text-green-500">{formState.message}</p>
        )}
        {formState?.error && typeof formState.error === "string" && (
          <p className="mt-3 italic text-red-500">{formState.error}</p>
        )}
      </form>
    </>
  );
}
