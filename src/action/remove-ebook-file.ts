"use server";

import { auth } from "src/auth";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { utapi } from "src/action/uploadthing";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export const removeEbookFile = async (formData: FormData) => {
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
        id: true,
        ebookFileKey: true,
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

  if (book.ebookFileKey) {
    try {
      await utapi.deleteFiles(book.ebookFileKey);
    } catch (e) {
      return { Error: "Error: Failed to delete book cover image." };
    }
  }

  if (book.ebookFileKey) {
    try {
      await prisma.book.update({
        where: {
          id: book.id,
        },
        data: {
          ebookFileName: null,
          ebookFileUrl: null,
          ebookFileKey: null,
        },
      });
    } catch (e) {
      return {
        Error: "Error: Failed to delete book cover image Url + Key in DB.",
      };
    }
  }

  revalidatePath("/library");
};
