import UserInfo from "@/components/user-info";
import QuoteFromAPI from "src/components/quote-from-api";
import { PrismaClient } from "@prisma/client";
import { auth } from "src/auth";
import RecentRead from "@/components/recent-read";

const prisma = new PrismaClient();

export default async function Page() {
  const session = await auth();
  if (!session) throw new Error("Not authenticated");
  const authUser = session.user;
  const userEmail = authUser?.email;
  if (!userEmail) throw new Error("Auth cannot determine your email");

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
        email: {
          select: {
            email: true,
          },
        },
        book: {
          where: {
            ebookFileName: {
              not: null,
            },
          },
          select: {
            id: true,
            title: true,
            author: true,
          },
          orderBy: {
            lastOpenAt: "desc",
          },
          take: 4,
        },
      },
    });
  } catch (e) {
    throw new Error("Network error: Cannot connect to DB");
  }

  if (!user) return "Cannot find user in DB";

  const emailList = user.email.map(({ email }) => ({
    email,
    isCurrent: email === userEmail,
  }));

  const bookList = user.book.map((book) => ({
    id: book.id,
    name: book.title,
    author: book.author,
  }));

  return (
    <div className="flex h-[80vh] flex-col justify-between">
      <div className="flex items-center justify-between px-5 py-5">
        <div className="w-1/3 pl-12">
          <UserInfo emailList={emailList} />
        </div>
        <div className="w-2/5">
          <QuoteFromAPI />
        </div>
      </div>
      <div className="flex items-center justify-center">
        <RecentRead bookList={bookList} />
      </div>
    </div>
  );
}
