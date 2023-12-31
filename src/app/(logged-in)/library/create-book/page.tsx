"use client";

import { useRef, useState } from "react";
import { UploadDropzone } from "src/components/uploadthing";
import Image from "next/image";
import { createBook } from "src/action/create-book";
import {
  CreateBookButton,
  CancelButton,
} from "@/components/create-book-form-button";
import { useFormState } from "react-dom";

export default function Page() {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const uploadedImageKeyRef = useRef<string | null>(null);
  const [uploadedEbookFileName, setUploadedEbookFileName] = useState<
    string | null
  >(null);
  const uploadedEbookFileUrlRef = useRef<string | null>(null);
  const uploadedEbookFileKeyRef = useRef<string | null>(null);

  const uploadedImage = uploadedImageUrl ? (
    <Image
      src={uploadedImageUrl}
      alt="uploaded image"
      height={400}
      width={300}
      className="mx-auto"
      placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkFGKUAQAAYgAyNQwTUgAAAABJRU5ErkJggg=="
    />
  ) : null;

  const imageUploadDropzone = (
    <div className="flex flex-col items-center">
      <p>Book Cover</p>
      <UploadDropzone
        endpoint="imageUploader"
        onClientUploadComplete={([uploadedFile]) => {
          uploadedImageKeyRef.current = uploadedFile.key;
          setUploadedImageUrl(uploadedFile.url);
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
        config={{
          mode: "auto",
        }}
      />
    </div>
  );

  const ebookFileUploadDropZone = (
    <div className="flex flex-col items-center">
      <p>Epub File</p>
      <UploadDropzone
        endpoint="ebookUploader"
        onClientUploadComplete={([uploadedFile]) => {
          uploadedEbookFileUrlRef.current = uploadedFile.url;
          uploadedEbookFileKeyRef.current = uploadedFile.key;
          setUploadedEbookFileName(uploadedFile.name);
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
        config={{
          mode: "auto",
        }}
      />
    </div>
  );

  const ebookFileNameAfterUpload = uploadedEbookFileName ? (
    <div className="text-center">
      <p className="mb-3 text-3xl">Ebook</p>
      <p>
        <span className="text-green-500">Succesfully uploaded</span>{" "}
        <span className="underline">{uploadedEbookFileName}</span>
      </p>
    </div>
  ) : null;

  return (
    <>
      <div className="m-auto flex h-screen w-4/5 pt-32">
        <div className="flex h-3/4 basis-1/3 flex-col items-center justify-between">
          {uploadedImage || imageUploadDropzone}
          {ebookFileNameAfterUpload || ebookFileUploadDropZone}
        </div>
        <div className="mt-20 basis-2/3">
          <Form
            imageUrl={uploadedImageUrl}
            imageKey={uploadedImageKeyRef.current}
            ebookName={uploadedEbookFileName}
            ebookUrl={uploadedEbookFileUrlRef.current}
            ebookKey={uploadedEbookFileKeyRef.current}
          />
        </div>
      </div>
    </>
  );
}

function Form({
  imageUrl,
  imageKey,
  ebookName,
  ebookUrl,
  ebookKey,
}: {
  imageUrl: string | null;
  imageKey: string | null;
  ebookName: string | null;
  ebookUrl: string | null;
  ebookKey: string | null;
}) {
  const [formState, formAction] = useFormState(createBook, null);

  const errorMessage = formState && (
    <p className="mt-3 text-red-700">{JSON.stringify(formState)}</p>
  );
  return (
    <form className="mx-auto my-auto max-w-lg" action={formAction}>
      <div className="group relative z-0 mb-5 w-full">
        <input type="hidden" name="imageUrl" value={imageUrl || ""} />
        <input type="hidden" name="imageKey" value={imageKey || ""} />
        <input type="hidden" name="ebookName" value={ebookName || ""} />
        <input type="hidden" name="ebookUrl" value={ebookUrl || ""} />
        <input type="hidden" name="ebookKey" value={ebookKey || ""} />
        <input
          type="text"
          name="title"
          id="title"
          className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
          placeholder=" "
          required
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
        />
        <label
          htmlFor="numberOfPages"
          className="transhtmlForm absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
        >
          Number Of Pages
        </label>
      </div>
      <div className="group relative z-0 mb-5 w-full">
        <select
          name="status"
          id="status"
          className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
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
      <CreateBookButton />
      <CancelButton />
      {errorMessage}
    </form>
  );
}
