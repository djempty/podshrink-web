import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      plan?: string;
      shrinkCount?: number;
      shrinkLimit?: number | null;
      shrinkCountResetAt?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    name?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    plan?: string;
    shrinkCount?: number;
    shrinkLimit?: number | null;
    shrinkCountResetAt?: string;
  }
}
