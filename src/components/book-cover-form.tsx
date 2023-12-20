"use client";

import Image from "next/image";
import { UploadDropzone } from "src/components/uploadthing";
import { RemoveBookCoverButton } from "src/components/book-cover-form-button";
import { removeBookCover } from "src/action/remove-book-cover";
import { addBookCover } from "src/action/add-book-cover";

export default function BookCoverForm({
  id,
  imageUrl,
}: {
  id: number;
  imageUrl: string | null;
}) {
  const image = imageUrl && (
    <Image
      src={imageUrl}
      alt="uploaded image"
      height={400}
      width={300}
      className="m-5 mt-0"
      placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkFGKUAQAAYgAyNQwTUgAAAABJRU5ErkJggg=="
    />
  );
  const uploader = !imageUrl && (
    <UploadDropzone
      endpoint="imageUploader"
      onClientUploadComplete={([uploadedFile]) => {
        const imageUrl = uploadedFile.url;
        const imageKey = uploadedFile.key;
        const addBookCoverAction = addBookCover.bind(
          null,
          id,
          imageUrl,
          imageKey,
        );
        addBookCoverAction();
      }}
      onUploadError={(error: Error) => {
        alert(`ERROR! ${error.message}`);
      }}
      config={{
        mode: "auto",
      }}
    />
  );

  return (
    <form
      action={removeBookCover}
      className="flex flex-col items-center justify-end"
    >
      <input type="hidden" name="id" value={id} />

      {image}
      {image && <RemoveBookCoverButton />}
      {uploader}
    </form>
  );
}
