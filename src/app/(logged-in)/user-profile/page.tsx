import { auth } from "../../../auth";
import Image from "next/image";

export default async function Page() {
  const session = await auth();
  const user = session?.user;
  const imageLink = user?.image;

  return (
    <div>
      <h1 className="text-center text-7xl">This is User Profile page</h1>
      <p className="text-4xl">Username: {user?.name}</p>
      <p className="text-4xl">Email address: {user?.email}</p>
      <p className="text-4xl">Profile image:</p>
      {imageLink && <Image src={imageLink} alt="Profile picture provided by OAuth provider." width={200} height={200} />}
    </div>
  );
}
