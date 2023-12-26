import { auth } from "src/auth";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import CreateNote from "src/components/create-note";
import Notes from "src/components/notes";
import EbookReader from "@/components/ebook-reader";

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
    book = await prisma.book.findFirst({
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

  if (!book?.ebookFileName || !book.ebookFileUrl)
    throw new Error("This book does not have Ebook file.");

  try {
    await prisma.book.update({
      where: {
        id: bookId,
      },
      data: {
        lastOpenAt: new Date(),
      },
    });
  } catch (e) {
    throw new Error("Network error: Cannot connect to DB server.");
  }

  const ownerId = book.id;
  const ownerName = book.title;

  const listOfNote = book.note
    .sort((a, b) => {
      if (a.lastModifiedAt > b.lastModifiedAt) return -1;
      if (a.lastModifiedAt < b.lastModifiedAt) return 1;
      return 0;
    })
    .map((note) => ({
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
    <div className="flex h-full w-full pl-0.5 pt-0.5">
      <div className="h-[94vh] basis-4/5 border border-gray-200 shadow-lg">
        <EbookReader
          ebookName={book.ebookFileName}
          ebookUrl={book.ebookFileUrl}
        />
      </div>
      <div className="flex h-[94vh] basis-1/5 flex-col items-center overflow-auto">
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
    </div>
  );
}
