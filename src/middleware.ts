export { auth as middleware } from "./auth"


export const config = {
  // Match everything except:
  // - /      deleted
  // - /api
  // - /_next/static
  // - /_next/image
  // - /favicon.ico

  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).+)"],
}