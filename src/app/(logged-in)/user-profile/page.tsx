import { auth } from "../../../auth";

export default async function Page() {
  const session = await auth();

  return (
    <div>
      <h1 className="text-center text-7xl">This is User Profile page</h1>
      <p className="text-4xl">This is raw user information:</p>
      <pre>{JSON.stringify(session, null, 2)};</pre>
      <p className="text-4xl">Use the json above to display user infos</p>
    </div>
  );
}
