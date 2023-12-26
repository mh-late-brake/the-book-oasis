import { auth } from "src/auth";
import { PrismaClient } from "@prisma/client";
import BookDetailPage from "@/components/book-detail-page";
import { revalidatePath } from "next/cache";

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
    book = await prisma.book.update({
      where: {
        id: bookId,
      },
      data: {
        lastOpenAt: new Date(),
      },
      include: {
        note: true,
      },
    });
    // revalidatePath("/library");
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

  revalidatePath("/library");

  return (
    <BookDetailPage
      book={book}
      listOfOwner={listOfOwner}
      listOfNote={listOfNote}
    />
  );
}
