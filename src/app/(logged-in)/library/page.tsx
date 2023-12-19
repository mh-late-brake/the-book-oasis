import BookCard from "src/components/book-card";
import AddBookCard from "src/components/add-book-card";
import { auth } from "src/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function Page() {
  const session = await auth();
  if (!session) return null;
  const authedUser = session.user!;
  const userEmail = authedUser.email;

  const user = await prisma.user.findFirst({
    where: {
      email: {
        some: {
          email: userEmail as string,
        },
      },
    },
  });

  if (!user) throw Error("Cannot find user in DB");

  const bookData = await prisma.book.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      coverImageUrl: true,
      title: true,
      author: true,
      genre: true,
      rating: true,
      status: true,
    },
  });

  return (
    <div className="mx-6 my-6 grid grid-cols-4 gap-7">
      <AddBookCard />
      {bookData.map((book) => (
        <BookCard
          key={book.id}
          coverImageUrl={book.coverImageUrl}
          title={book.title}
          author={book.author}
          genre={book.genre}
          rating={book.rating}
          status={book.status}
        />
      ))}
    </div>
  );
}
