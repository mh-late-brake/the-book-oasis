import Link from "next/link";

export default function RecentRead({
  bookList,
}: {
  bookList: Array<{ id: number; name: string; author: string | null }>;
}) {
  return (
    <div className="flex w-2/5 flex-col items-center justify-between rounded-2xl border border-gray-100 p-6 py-8 shadow-lg">
      <div>
        <p className="mb-8 text-center text-3xl text-gray-700">
          Recent Ebook Available
        </p>
      </div>
      <div className="grid grid-cols-4 gap-5">
        {bookList.map((book) => (
          <Card
            key={book.id}
            id={book.id}
            name={book.name}
            author={book.author}
          />
        ))}
      </div>
    </div>
  );
}

const Card = ({
  id,
  name,
  author,
}: {
  id: number;
  name: string;
  author: string | null;
}) => {
  return (
    <Link href={`/library/read/${id}`}>
      <div className="max-w-xs rounded-lg border border-gray-100 bg-gray-50 p-3 shadow-md hover:bg-gray-200">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-700">
          {name}
        </h5>
        <p className="font-normal text-gray-700">{author}</p>
      </div>
    </Link>
  );
};
