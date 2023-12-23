"use server";

import { z } from "zod";
import { auth } from "src/auth";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export const createNote = async (prevFromState: any, formData: FormData) => {
  const session = await auth();

  if (!session) return { error: "not authenticated" };

  const userEmail = session.user?.email;

  const dataSchema = z.object({
    title: z.string().min(1, { message: "title is required" }),
    content: z.string().nullable().default(null),
    selectedOwnerId: z.coerce.number(),
  });

  const parsed = dataSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    selectedOwnerId: formData.get("selectedOwnerId"),
  });

  if (!parsed.success)
    return {
      error: parsed.error.flatten().fieldErrors,
    };

  let currentUser;

  try {
    currentUser = await prisma.user.findFirst({
      where: {
        email: {
          some: {
            email: userEmail as string,
          },
        },
      },
    });
  } catch (e) {
    return { error: "Network error: Failed to connect to database server." };
  }

  if (!currentUser) return { error: "cannot find current user in the DB" };

  if (parsed.data.selectedOwnerId > 0) {
    let book;

    try {
      book = await prisma.book.findFirst({
        where: {
          id: parsed.data.selectedOwnerId,
        },
        select: {
          userId: true,
          id: true,
        },
      });
    } catch (e) {
      return { error: "Network error: Failed to connect to database server." };
    }

    if (!book) return { error: "cannot find book in DB" };

    if (book.userId !== currentUser.id)
      return { error: "you are not the book owner" };
  }

  const bookId =
    parsed.data.selectedOwnerId > 0 ? parsed.data.selectedOwnerId : null;

  try {
    await prisma.note.create({
      data: {
        title: parsed.data.title,
        content: parsed.data.content,
        createdAt: new Date(),
        lastModifiedAt: new Date(),
        userId: currentUser.id,
        bookId: bookId,
      },
    });
  } catch (e) {
    return { error: "Network error: Failed to connect to database server." };
  }

  revalidatePath("/notes");
  return "success";
};
