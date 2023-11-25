import Link from "next/link";
import { SignInButton, SignOutButton } from "../../component/authComponent";

export default function Page() {
  return (
    <>
      <p className="text-7xl text-blue-800">Home page</p>
      <Link href="/library" className="text-4xl">
        Go to library
      </Link>
      <SignInButton />
      <SignOutButton />
    </>
  );
}
