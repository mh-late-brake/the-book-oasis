import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();

  return (
    <div>
      <p>This is user information:</p>
      <pre>{JSON.stringify(session, null, 2)};</pre>
    </div>
  );
}
