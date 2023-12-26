"use client";

import { UploadDropzone } from "src/components/uploadthing";
import { RemoveEbookFileButton } from "src/components/ebook-form-button";
import { addEbookFile } from "src/action/add-ebook-file";
import { removeEbookFile } from "src/action/remove-ebook-file";

export default function EbookForm({
  id,
  ebookFileName,
}: {
  id: number;
  ebookFileName: string | null;
}) {
  const ebook = ebookFileName ? (
    <div className="mb-2 mt-10 text-center">
      <p className="mb-3 text-3xl">Ebook</p>
      <p>
        <span className="underline">{ebookFileName}</span>
      </p>
    </div>
  ) : null;

  const uploader = !ebookFileName && (
    <div className="mt-10 flex flex-col items-center">
      <p>Epub File</p>
      <UploadDropzone
        endpoint="ebookUploader"
        onClientUploadComplete={([uploadedFile]) => {
          const ebookName = uploadedFile.name;
          const ebookUrl = uploadedFile.url;
          const ebookKey = uploadedFile.key;
          const addEbookFileAction = addEbookFile.bind(
            null,
            id,
            ebookName,
            ebookUrl,
            ebookKey,
          );
          addEbookFileAction();
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

  return (
    <form
      action={removeEbookFile}
      className="flex flex-col items-center justify-end"
    >
      <input type="hidden" name="id" value={id} />

      {ebook}
      {ebook && <RemoveEbookFileButton />}
      {uploader}
    </form>
  );
}
