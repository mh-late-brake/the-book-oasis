import Link from "next/link";
import { SignInButton, SignOutButton } from "../../components/auth-components";
import { auth } from "../../auth";

export default function Page() {
  return (
    <div className="flex h-screen w-screen items-center">
      <div className="p-10 text-center">
        <h1 className="text-7xl font-bold">This is Welcome page</h1>
        <p className="text-xl">
          Display the features of the site (purpose, feature, ...)
        </p>
      </div>
      <LoginBox />
    </div>
  );
}

const LoginBox = async () => {
  const session = await auth();
  const loginStatus = session ? <p className="my-5">You have logged in</p> : <p className="my-5">Login to use our app</p>;
  return (
    <div className="text-center text-4xl space-x-10 p-8 fixed right-40 h-2/3 w-1/4 overflow-hidden border-2 border-slate-300 bg-slate-200">
      {session && <p>Hello, {session.user?.name}</p>}
      {loginStatus}
      {session ? <Link href="/home" className="text-blue-600 underline">Go to Home page</Link> : <SignInButton /> }
    </div>
  );
};
