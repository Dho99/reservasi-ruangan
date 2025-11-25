export { auth as middleware } from "@/auth"

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|user/login|admin/login|admin/register|user/register).*)"],
}