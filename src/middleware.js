import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/",
  },
});

export const config = {
  matcher: [
    // 對下列所有符合的路由套用中介層驗證
    "/app/:path*",
    "/dashboard/:path*",
    "/settings/:path*",
    "/studio/:path*",
    "/notebook-lm/:path*",
  ],
};
