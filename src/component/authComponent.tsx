import { signIn, signOut } from "@/auth"
import { redirect } from "next/navigation"

export function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        const url = await signIn(undefined, { redirect: false })
        // TODO: fix in next-auth
        redirect(url.replace("signin", "api/auth/signin"))
      }}
    >
      <button>Sign In</button>
    </form>
  )
}

export function SignOut() {
  return (
    <form
      action={async () => {
        "use server"
        await signOut()
      }}
      className="w-full"
    >
      <button className="w-full p-0">
        Sign Out
      </button>
    </form>
  )
}
