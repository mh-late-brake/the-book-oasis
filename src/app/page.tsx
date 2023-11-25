import Link from "next/link";
import { SignIn } from "../component/authComponent";

export default function Home() {
  return (
    <>
      <p className="text-7xl text-blue-800">Home page</p>
      <Link href="/library" className="text-4xl">
        Go to library
      </Link>
      <SignIn />
    </>
  );
}
