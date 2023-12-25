"use server";

import { z } from "zod";
import { auth } from "src/auth";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export const createBook = async (prevFromState: any, formData: FormData) => {
  const session = await auth();

  if (!session) return { error: "not authenticated" };

  const userEmail = session.user?.email;

  const dataSchema = z.object({
    url: z.string(),
    key: z.string(),
    title: z.string().min(1, { message: "title is required" }),
    author: z.string(),
    genre: z.string(),
    numberOfPages: z.coerce
      .number({ invalid_type_error: "number of pages must be a number" })
      .int({ message: "number of pages must be an int" })
      .min(0, { message: "how tf can a book have less than 0 page?" }),
    status: z.enum(["ToRead", "Reading", "Read", "Paused", "Abandoned"]),
  });

  const parsed = dataSchema.safeParse({
    url: formData.get("imageUrl"),
    key: formData.get("imageKey"),
    title: formData.get("title"),
    author: formData.get("author"),
    genre: formData.get("genre"),
    numberOfPages: formData.get("numberOfPages"),
    status: formData.get("status"),
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

  let successful = false;

  try {
    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        book: {
          create: {
            title: parsed.data.title,
            author: parsed.data.author || null,
            genre: parsed.data.genre || null,
            numberOfPages: parsed.data.numberOfPages || null,
            status: parsed.data.status,
            coverImageUrl: parsed.data.url || null,
            coverImageKey: parsed.data.key || null,
            createdAt: new Date(),
            lastOpenAt: new Date(),
          },
        },
      },
      include: {
        book: true,
      },
    });
    successful = true;
  } catch (e) {
    return { error: "Network error: Failed to connect to database server." };
  }
  if (successful) {
    revalidatePath("/library");
    redirect("/library");
  } else {
    return { error: "Something bad happended." };
  }
};
