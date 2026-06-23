import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      const allowedEmails = [
        "wrc0315@gmail.com",
        "toyear520@gmail.com",
        "dada95712@gmail.com",
        "pai9067113@gmail.com",
        "sunnymisaki1977@gmail.com"
      ];
      if (user && user.email) {
        return allowedEmails.includes(user.email.toLowerCase());
      }
      return false;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: '/', 
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
