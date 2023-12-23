"use server";

import { z } from "zod";
import { auth } from "src/auth";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export const deleteNote = async (prevFormState: any, formData: FormData) => {
  const session = await auth();

  if (!session) return { error: "not authenticated" };

  const userEmail = session.user?.email;

  const noteIdSchema = z.coerce.number();

  const parsed = noteIdSchema.safeParse(formData.get("id"));

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
        id: parsed.data,
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

  //Delete note

  try {
    await prisma.note.delete({
      where: {
        id: parsed.data,
      },
    });
  } catch (e) {
    return { error: "Network error: Failed to connect to database server." };
  }

  revalidatePath("/notes");
  return "success";
};
