"use client";
import { ReactReader } from "react-reader";
import useLocalStorageState from "use-local-storage-state";

export default function EbookReader({
  ebookName,
  ebookUrl,
}: {
  ebookName: string;
  ebookUrl: string;
}) {
  const [location, setLocation] = useLocalStorageState<string | number>(
    "the-book-oasis-ebook-reader-location",
    {
      defaultValue: 0,
    },
  );

  return (
    <div className="h-[94vh]">
      <ReactReader
        url={ebookUrl}
        title={ebookName}
        location={location}
        locationChanged={(loc: string) => setLocation(loc)}
        // epubOptions={{
        //   flow: "scrolled",
        //   manager: "continuous",
        // }}
      />
    </div>
  );
}
