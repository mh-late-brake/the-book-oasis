import { auth } from "src/auth";
import { PrismaClient } from "@prisma/client";
import NotesPage from "@/components/notes-page";

const prisma = new PrismaClient();

export default async function Page() {
  const session = await auth();
  if (!session) throw new Error("not authenticated");
  const authedUser = session.user!;
  const userEmail = authedUser.email;

  let user;

  try {
    user = await prisma.user.findFirst({
      where: {
        email: {
          some: {
            email: userEmail as string,
          },
        },
      },
      select: {
        id: true,
        book: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  } catch (e) {
    throw new Error("Network error: failed to connect to DB server.");
  }

  if (!user) throw new Error("Cannot find user in DB");

  let listOfOwner = user.book.map((book) => ({
    id: book.id,
    name: book.title,
  }));
  listOfOwner.unshift({
    id: -1,
    name: "General Note",
  });

  let notes;
  try {
    notes = await prisma.note.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        userId: true,
        bookId: true,
        title: true,
        content: true,
        lastModifiedAt: true,
        book: {
          select: {
            title: true,
          },
        },
      },
    });
  } catch (e) {
    throw new Error("Network error: failed to connect to DB server.");
  }

  const listOfNote = notes.map((note) => {
    const ownerId = note.bookId || -1;
    const ownerName = note.book?.title || "General Note";
    return {
      noteId: note.id,
      noteTitle: note.title,
      noteContent: note.content,
      lastModifiedAt: note.lastModifiedAt,
      ownerId,
      ownerName,
    };
  });

  return <NotesPage listOfOwner={listOfOwner} listOfNote={listOfNote} />;
}
