import { auth } from "src/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      // This code runs on your server before upload
      const session = await auth();

      // If you throw, the user will not be able to upload
      if (!session) throw new Error("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userEmail: session.user?.email };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for user:", metadata.userEmail);
      console.log("file url", file.url);
      console.log("file key", file.key);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      // The uploaded file's imformation is sent to the client by default (uploadthing's default), including key and url.
      // So, I don't need to explicitly return anything.
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
