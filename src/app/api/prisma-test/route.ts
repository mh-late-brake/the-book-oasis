import { auth } from "src/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const GET = async () => {
  const session = await auth();

  if (!session)
    return Response.json({
      error: "Not authenticated",
    });

  const user = session.user!;

  try {
    const response = await prisma.user.create({
      data: {
        email: user.email!,
      },
    });
    return Response.json({ response });
  } catch (error) {
    return Response.json(error);
  }
};

export { GET };
