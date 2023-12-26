"use client";

import EbookReader from "@/components/ebook-reader";

export default function Page() {
  const book = {
    ebookFileName: "Test",
    ebookFileUrl: "abc",
  };
  return (
    <div className="flex h-full">
      <div className="basis-2/3">
        <EbookReader
          ebookName={book.ebookFileName}
          ebookUrl={book.ebookFileUrl}
        />
      </div>
    </div>
  );
}
