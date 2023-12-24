import Link from "next/link";
import { IoIosAddCircleOutline } from "react-icons/io";

export default function AddBookCard() {
  return (
    <Link href="/library/create-book">
      <div className="flex h-72 max-w-md flex-row justify-center rounded-lg border border-gray-200 bg-gray-50 shadow-md hover:bg-gray-100 hover:shadow-lg">
        <div className="my-auto">
          <IoIosAddCircleOutline className="mx-auto" size="100" />
          <p className="text-2xl">Add Book</p>
        </div>
      </div>
    </Link>
  );
}
