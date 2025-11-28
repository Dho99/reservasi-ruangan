export { auth as middleware } from "@/auth"
import { NextRequest, NextResponse } from "next/server"

export default function proxy(request: NextRequest) {
//   return NextResponse.redirect(new URL('/home', request.url))
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|user/login|admin/login|admin/register|user/register).*)"],
}