import Link from "next/link";

export default function Home() {
  return (
    <div>
      <p className="text-blue-800 text-7xl">Home page</p>
      <p className="text-5xl">This is where I put marketing content of the page</p>
      <p className="text-3xl">Everybody can visit this page. But to continue, have to sign in</p>
      <Link className="text-red-600 text-2xl underline" href="/library">Click here to sign in and go to library</Link>
    </div>
  );
}
