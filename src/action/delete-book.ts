"use server";
import { auth } from "src/auth";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { utapi } from "src/action/uploadthing";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export const deleteBook = async (formData: FormData) => {
  const session = await auth();
  if (!session) return { error: "Not authenticated" };
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
    return { error: "Network error: Cannot connect to DB server." };
  }

  if (!thisUser) return { error: "Error: Cannot find current user in DB." };

  const idSchema = z.coerce.number();
  const parsedId = idSchema.safeParse(formData.get("id"));

  if (!parsedId.success)
    return {
      error: parsedId.error.flatten().fieldErrors,
    };

  if (typeof parsedId.data !== "number")
    return {
      error: "Error: Invalid BookId.",
    };

  let book;

  try {
    book = await prisma.book.findUnique({
      where: {
        id: parsedId.data,
      },
      select: {
        userId: true,
        coverImageUrl: true,
        coverImageKey: true,
        id: true,
      },
    });
  } catch (e) {
    return {
      error: "Network error: Cannot connect to DB server.",
    };
  }

  if (!book) return { error: "Error: Cannot find book in DB." };

  if (book.userId !== thisUser.id)
    return {
      error: "You are not the book owner.",
    };

  if (book.coverImageKey) {
    try {
      await utapi.deleteFiles(book.coverImageKey);
    } catch (e) {
      return { Error: "Error: Failed to delete book cover image." };
    }
  }

  try {
    await prisma.note.deleteMany({
      where: {
        bookId: book.id,
      },
    });
  } catch (e) {
    return {
      error: "Error: Failed to delete bookNote associated with this book.",
    };
  }

  try {
    await prisma.book.delete({
      where: {
        id: book.id,
      },
    });
  } catch (e) {
    return { error: "Error: Failed to delete 1 row in Book table." };
  }

  revalidatePath("/library");
  redirect("/library");
};
