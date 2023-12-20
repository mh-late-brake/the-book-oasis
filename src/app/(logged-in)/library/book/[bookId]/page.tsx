import BookDetailForm from "src/components/book-detail-form";
import BookCoverForm from "src/components/book-cover-form";
import { auth } from "src/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function Page({ params }: { params: { bookId: string } }) {
  const bookId = Number(params.bookId);
  if (typeof bookId !== "number") throw new Error("Invalid bookId");

  const session = await auth();
  if (!session) throw new Error("Not authenticated");
  const user = session.user!;
  const userEmail = user.email!;

  let thisUser;

  try {
    thisUser = await prisma.user.findFirst({
      where: {
        email: {
          some: {
            email: userEmail,
          },
        },
      },
    });
  } catch (e) {
    throw new Error("Network error: Cannot connect to DB server.");
  }

  if (!thisUser) throw new Error("Error: Cannot find current user in DB.");

  let book;

  try {
    book = await prisma.book.findUnique({
      where: {
        id: bookId,
      },
    });
  } catch (e) {
    throw new Error("Network error: Cannot connect to DB server.");
  }

  if (!book) throw new Error("Error: Cannot find book with this id in DB.");

  if (thisUser.id !== book.userId)
    throw new Error("Error: You are not the owner of this book.");

  return (
    <div className="m-auto mt-44 flex h-screen w-4/5">
      <div className="basis-1/3">
        <BookCoverForm id={book.id} imageUrl={book.coverImageUrl} />
      </div>
      <div className="basis-2/3">
        <BookDetailForm
          id={book.id}
          title={book.title}
          author={book.author}
          genre={book.genre}
          numberOfPages={book.numberOfPages}
          status={book.status}
          rating={book.rating}
          startReadingAt={book.startReadingAt}
          finishReadingAt={book.finishReadingAt}
        />
      </div>
    </div>
  );
}
