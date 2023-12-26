"use client";
import { useState } from "react";
import { ReactReader } from "react-reader";
import useLocalStorageState from "use-local-storage-state";

export default function EbookReader({
  ebookName,
  ebookUrl,
}: {
  ebookName: string;
  ebookUrl: string;
}) {
  // const [location, setLocation] = useLocalStorageState<string | number>(
  //   "the-book-oasis-ebook-reader-location",
  //   {
  //     defaultValue: 0,
  //   },
  // );

  const [location, setLocation] = useState<string | number>(0);

  const url =
    "https://utfs.io/f/4c6e5d26-8976-4e77-961d-4e29fdb524ea-lishud.epub";

  return (
    <div className="h-full">
      <ReactReader
        url={url}
        title={ebookName}
        location={location}
        locationChanged={(loc: string) => setLocation(loc)}
        epubOptions={{
          flow: "scrolled",
          manager: "continuous",
        }}
      />
    </div>
  );
}
