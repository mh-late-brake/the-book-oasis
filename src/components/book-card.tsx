import Image from "next/image";
import RatingBar from "./rating-bar";
import { Book } from "@prisma/client";
import Link from "next/link";
import altBookCover from "src/assets/book-cover.jpg";

type InputType = Omit<
  Book,
  | "numberOfPages"
  | "createdAt"
  | "startReadingAt"
  | "finishReadingAt"
  | "coverImageKey"
  | "ebookFileUrl"
  | "ebookFileKey"
  | "userId"
  | "lastOpenAt"
>;

export default function BookCard({
  id,
  coverImageUrl,
  title,
  author,
  genre,
  status,
  rating,
}: InputType) {
  const imageUrl = coverImageUrl || altBookCover;

  return (
    <Link href={"/library/book/" + id}>
      <div className="flex h-72 max-w-md flex-row rounded-lg border border-gray-200 bg-gray-50 shadow-md hover:bg-gray-100 hover:shadow-lg">
        <Image
          className="h-96 w-full rounded-t-lg object-cover md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
          src={imageUrl}
          alt="Book Cover"
          width={200}
          height={200}
        />
        <div className="flex w-full flex-col justify-between p-4 leading-normal">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
            {title}
          </h5>
          <div className="flex justify-between text-gray-700">
            <span>Author:</span>
            <span className="text-right">{author || "---"}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Genre:</span>
            <span className="text-right">{genre || "---"}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Status:</span>
            <span className="text-right">{status || "---"}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Rating:</span>
            <span>
              <RatingBar rating={rating} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
