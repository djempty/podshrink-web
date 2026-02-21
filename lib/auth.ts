import NextAuth, { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const response = await fetch(`${API_URL}/api/auth/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password
            })
          });

          if (!response.ok) {
            return null;
          }

          const data = await response.json();
          
          if (data.user) {
            return {
              id: String(data.user.id),
              email: data.user.email,
              name: data.user.email.split('@')[0] // Use email prefix as name for now
            };
          }
          
          return null;
        } catch (error) {
          console.error('Error during authorization:', error);
          return null;
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    // Apple provider - uncomment when credentials are available
    // AppleProvider({
    //   clientId: process.env.APPLE_ID || "",
    //   clientSecret: process.env.APPLE_SECRET || "",
    // })
  ],
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      
      // Fetch user plan info from backend on token creation or update
      if (token.id && (trigger === 'signIn' || trigger === 'signUp' || !token.plan)) {
        try {
          const response = await fetch(`${API_URL}/api/auth/me?userId=${token.id}`);
          if (response.ok) {
            const userData = await response.json();
            token.plan = userData.plan;
            token.shrinkCount = userData.shrinkCount;
            token.shrinkLimit = userData.shrinkLimit;
            token.shrinkCountResetAt = userData.shrinkCountResetAt;
          }
        } catch (error) {
          console.error('Error fetching user plan:', error);
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.plan = token.plan as string;
        session.user.shrinkCount = token.shrinkCount as number;
        session.user.shrinkLimit = token.shrinkLimit as number | null;
        session.user.shrinkCountResetAt = token.shrinkCountResetAt as string;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
