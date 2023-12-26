import { auth } from "src/auth";
import { PrismaClient } from "@prisma/client";
import LibaryPage from "@/components/library-page";

const prisma = new PrismaClient();

export default async function Page() {
  const session = await auth();
  if (!session) throw new Error("not authenticated");
  const authedUser = session.user!;
  const userEmail = authedUser.email;

  let user;

  try {
    user = await prisma.user.findFirst({
      where: {
        email: {
          some: {
            email: userEmail as string,
          },
        },
      },
    });
  } catch (e) {
    throw new Error("Network error: failed to connect to DB server.");
  }

  if (!user) throw new Error("Cannot find user in DB");

  let bookData;

  try {
    bookData = await prisma.book.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        coverImageUrl: true,
        title: true,
        author: true,
        genre: true,
        rating: true,
        status: true,
        lastOpenAt: true,
        ebookFileName: true,
      },
    });
  } catch (e) {
    throw new Error("Network error: failed to connect to DB server.");
  }

  return <LibaryPage bookData={bookData} />;
}
