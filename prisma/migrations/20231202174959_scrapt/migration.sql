-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "User" ADD CONSTRAINT "User_pkey" PRIMARY KEY ("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");
