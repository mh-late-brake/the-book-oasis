"use server";
import { auth } from "src/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const updateBook = async (prevFromState: any, formData: FormData) => {
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
    throw new Error("Network error: Cannot connect to DB server.");
  }

  if (!thisUser) throw new Error("Error: Cannot find current user in DB.");

  const dataSchema = z.object({
    id: z.coerce.number(),
    title: z.string().min(1, "title is required"),
    author: z.string(),
    genre: z.string(),
    numberOfPages: z.coerce
      .number({ invalid_type_error: "number of pages must be a number" })
      .int("number of pages must be an int")
      .min(0, "how tf can a book have less than 0 page?"),
    status: z.enum(["ToRead", "Reading", "Read", "Paused", "Abandoned"]),
    rating: z.enum(["Star1", "Star2", "Star3", "Star4", "Star5", ""]),
    startReadingAt: z.coerce.date().nullable().default(null),
    finishReadingAt: z.coerce.date().nullable().default(null),
  });

  const parsed = dataSchema.safeParse({
    id: formData.get("id"),
    url: formData.get("imageUrl"),
    key: formData.get("imageKey"),
    title: formData.get("title"),
    author: formData.get("author"),
    genre: formData.get("genre"),
    numberOfPages: formData.get("numberOfPages"),
    status: formData.get("status"),
    rating: formData.get("rating"),
    startReadingAt: formData.get("startReadingAt"),
    finishReadingAt: formData.get("finishReadingAt"),
  });

  if (!parsed.success)
    return {
      error: parsed.error.flatten().fieldErrors,
    };
  if (typeof parsed.data.id !== "number")
    return {
      error: "Error: Invalid BookId.",
    };

  const bookData = parsed.data;

  let book;

  try {
    book = await prisma.book.findUnique({
      where: {
        id: bookData.id,
      },
      select: {
        userId: true,
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

  try {
    await prisma.book.update({
      where: {
        id: bookData.id,
      },
      data: {
        title: bookData.title,
        author: bookData.author || null,
        genre: bookData.genre || null,
        numberOfPages: bookData.numberOfPages || null,
        status: bookData.status || null,
        rating: bookData.rating || null,
        startReadingAt: bookData.startReadingAt || null,
        finishReadingAt: bookData.finishReadingAt || null,
      },
    });
  } catch (e) {
    return { error: "Error: DB server error when update book data." };
  }

  revalidatePath("/library");
  return { message: "Successfully updated." };
};
