"use server";

import { auth } from "src/auth";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export const addEbookFile = async (
  id: number,
  ebookName: string,
  ebookUrl: string,
  ebookKey: string,
) => {
  console.log("Running add-book-cover server action");
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

  let book;

  try {
    book = await prisma.book.findUnique({
      where: {
        id: id,
      },
      select: {
        userId: true,
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

  try {
    await prisma.book.update({
      where: {
        id: book.id,
      },
      data: {
        ebookFileName: ebookName,
        ebookFileUrl: ebookUrl,
        ebookFileKey: ebookKey,
      },
    });
  } catch (e) {
    return {
      Error: "Error: Failed to update imageUrl + imageKey in DB.",
    };
  }
  console.log("Finish add-book-cover server action.");

  revalidatePath("/library");
};
