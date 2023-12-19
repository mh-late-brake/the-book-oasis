import { BookRating } from "@prisma/client";
import { YellowStar, BlackStar } from "./rating-star";

export default function RatingBar({ rating }: { rating: BookRating | null }) {
  if (!rating) return <div>---</div>;

  const bookRating = {
    Star1: 1,
    Star2: 2,
    Star3: 3,
    Star4: 4,
    Star5: 5,
  };
  const numberOfYellowStar = bookRating[rating];
  const numberOfBlackStar = 5 - numberOfYellowStar;

  const yellowStars = Array(numberOfYellowStar)
    .fill(true)
    .map((_, i) => <YellowStar key={i} />);
  const blackStars = Array(numberOfBlackStar)
    .fill(true)
    .map((_, i) => <BlackStar key={i} />);

  return (
    <div className="flex items-center">
      {yellowStars}
      {blackStars}
    </div>
  );
}
