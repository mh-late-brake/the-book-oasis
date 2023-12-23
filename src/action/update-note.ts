"use server";

import { z } from "zod";
import { auth } from "src/auth";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export const updateNote = async (prevFromState: any, formData: FormData) => {
  const session = await auth();

  if (!session) return { error: "not authenticated" };

  const userEmail = session.user?.email;

  const dataSchema = z.object({
    id: z.coerce.number(),
    title: z.string().min(1, { message: "title is required" }),
    content: z.string().nullable().default(null),
    selectedOwnerId: z.coerce.number(),
  });

  const parsed = dataSchema.safeParse({
    id: formData.get("id"),
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

  // Check note

  let note;

  try {
    note = await prisma.note.findFirst({
      where: {
        id: parsed.data.id,
      },
      select: {
        userId: true,
      },
    });
  } catch (e) {
    return "failed to connect to DB";
  }

  if (!note) return "invalid noteId";

  if (currentUser.id !== note.userId)
    return "you are not the owner of this note";

  // check book (only if the user want to connect this note with a book)

  if (parsed.data.selectedOwnerId > 0) {
    let book;

    try {
      book = await prisma.book.findFirst({
        where: {
          id: parsed.data.selectedOwnerId,
        },
        select: {
          userId: true,
        },
      });
    } catch (e) {
      return "failed to connect to DB";
    }

    if (!book) return "invalid bookId";

    if (book.userId !== currentUser.id) return "you are not the book owner";
  }

  // update

  const newNoteOwnerId =
    parsed.data.selectedOwnerId > 0 ? parsed.data.selectedOwnerId : null;

  try {
    await prisma.note.update({
      where: {
        id: parsed.data.id,
      },
      data: {
        title: parsed.data.title,
        content: parsed.data.content,
        bookId: newNoteOwnerId,
        lastModifiedAt: new Date(),
      },
    });
  } catch (e) {
    return "failed to connect to DB";
  }
  console.log("update note server action running");

  revalidatePath("/notes");
  return "success";
};
