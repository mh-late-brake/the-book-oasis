"use server";

import { auth } from "src/auth";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export default async function deleteEmail(
  prevFormState: any,
  formData: FormData,
) {
  const session = await auth();
  if (!session) return "Not authenticated";
  const authUser = session.user;
  const userEmail = authUser?.email;
  if (!userEmail) return "Auth cannot determine your email";

  const emailSchema = z.string();

  const parsed = emailSchema.safeParse(formData.get("email"));

  if (!parsed.success) return "Error while parsing email from formData";

  const willDeleteEmail = parsed.data;

  if (willDeleteEmail === userEmail)
    return "Cannot remove currently active email";

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
        email: {
          select: {
            email: true,
          },
        },
      },
    });
  } catch (e) {
    return "Network error: Cannot connect to DB";
  }

  const currentAuthUserOwnWillBeDeletedEmail = user?.email.reduce(
    (result, { email }) => result || email === willDeleteEmail,
    false,
  );

  if (!currentAuthUserOwnWillBeDeletedEmail)
    return "This email does not belong to the current account";

  try {
    await prisma.email.delete({
      where: {
        email: willDeleteEmail,
      },
    });
  } catch (e) {
    return "Network error: Cannot connect to DB";
  }

  revalidatePath("/home");
}
