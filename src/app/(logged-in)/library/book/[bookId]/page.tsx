import BookDetailForm from "src/components/book-detail-form";
import BookCoverForm from "src/components/book-cover-form";
import { auth } from "src/auth";
import { PrismaClient } from "@prisma/client";
import CreateNote from "src/components/create-note";
import Notes from "src/components/notes";

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
      include: {
        note: true,
      },
    });
  } catch (e) {
    throw new Error("Network error: Cannot connect to DB server.");
  }

  if (!book) throw new Error("Error: Cannot find book with this id in DB.");

  if (thisUser.id !== book.userId)
    throw new Error("Error: You are not the owner of this book.");

  const ownerId = book.id;
  const ownerName = book.title;

  const listOfNote = book.note.map((note) => ({
    noteId: note.id,
    noteTitle: note.title,
    noteContent: note.content,
    ownerId,
    ownerName,
  }));

  let listOfOwner;

  try {
    listOfOwner = await prisma.book.findMany({
      where: {
        userId: thisUser.id,
      },
      select: {
        id: true,
        title: true,
      },
    });
  } catch (e) {
    throw new Error("Error: Cannot connect to DB server");
  }

  listOfOwner.unshift({
    id: -1,
    title: "General Note",
  });

  return (
    <>
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
      <div className="grid grid-cols-5 gap-7 p-5">
        <CreateNote
          defaultOwnerId={book.id}
          listOfOwner={listOfOwner.map((owner) => ({
            id: owner.id,
            name: owner.title,
          }))}
        />
        <Notes
          listOfNote={listOfNote}
          listOfOwner={listOfOwner.map((owner) => ({
            ownerId: owner.id,
            ownerName: owner.title,
          }))}
        />
      </div>
    </>
  );
}
