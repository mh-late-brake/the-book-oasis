"use server";

import { auth } from "src/auth";
import { z } from "zod";
import { Prisma, PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export default async function addEmail(prevFormState: any, formData: FormData) {
  const session = await auth();
  if (!session) return "Not authenticated";
  const authUser = session.user;
  const userEmail = authUser?.email;
  if (!userEmail) return "Auth cannot determine your email";

  const emailSchema = z.string();

  const parsed = emailSchema.safeParse(formData.get("email"));

  if (!parsed.success) return "Error while parsing email from formData";

  const willAddEmail = parsed.data;

  let user;

  try {
    user = await prisma.user.findFirst({
      where: {
        email: {
          some: {
            email: userEmail,
          },
        },
      },
      select: {
        id: true,
      },
    });
  } catch (e) {
    return "Network error: Cannot connect to DB";
  }

  if (!user) return "Cannot find user in DB";

  try {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        email: {
          create: {
            email: willAddEmail,
          },
        },
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") return "Email already exist in DB";
    }
    return "Network error: Cannot connect to DB";
  }

  revalidatePath("/home");
}
