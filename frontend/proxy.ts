import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const middleware = async (req: NextRequest) => {
  const pathname = req.nextUrl;
  const nextAuthSession = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  const customLoginSession =
    req.cookies.get("access_token") || req.cookies.get("refresh_token");

  const isAuthenticated = !!nextAuthSession || !!customLoginSession;

  if (
    pathname.pathname.startsWith("/profile") ||
    pathname.pathname.startsWith("/admin")
  ) {
    if (!isAuthenticated) {
      const homeUrl = new URL("/", req.url);
      return NextResponse.redirect(homeUrl);
    }
    return NextResponse.next();
  }
};

export const config = {
  matcher: ["/profile/:path*", "/admin/:path*"],
};

export default middleware;
