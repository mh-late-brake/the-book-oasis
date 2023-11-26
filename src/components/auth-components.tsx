import { signIn, signOut } from "../auth"
import { redirect } from "next/navigation"

export function SignInButton() {
  return (
    <form
      action={async () => {
        "use server"
        const url = await signIn(undefined, { redirect: false })
        // TODO: fix in next-auth
        redirect(url.replace("signin", "api/auth/signin"))
      }}
    >
      <button className="text-blue-600 underline">Sign In</button>
    </form>
  )
}


export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
      className="w-full"
    >
      <button>Sign Out</button>
    </form>
  );
}