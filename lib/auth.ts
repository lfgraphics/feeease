import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/db";
import AdminUser from "@/models/AdminUser";
import School from "@/models/School";
import bcrypt from "bcryptjs";
import { decrypt } from "@/lib/crypto";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        await dbConnect();

        // 1. Try to find in AdminUser
        let user: any = await AdminUser.findOne({ email: credentials.email });
        let role = user?.role;
        let requiresPasswordChange = user?.requiresPasswordChange;

        // 2. If not found, try to find in School (School Owner)
        if (!user) {
          const school = await School.findOne({ adminEmail: credentials.email });
          if (school) {
            user = {
              _id: school._id,
              fullName: school.adminName,
              email: school.adminEmail,
              passwordHash: school.adminPasswordHash,
              isActive: true, // Schools are active if they exist here (subscription handled elsewhere)
            };
            role = "school_owner";
            requiresPasswordChange = false; // Schools manage pwd differently usually
          }
        }

        if (!user) {
          throw new Error("User not found");
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);

        if (!isValid) {
          throw new Error("Invalid password");
        }

        if (!user.isActive) {
          throw new Error("Account is disabled");
        }

        return {
          id: user._id.toString(),
          name: user.fullName,
          email: user.email,
          role: role,
          requiresPasswordChange: requiresPasswordChange,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.requiresPasswordChange = user.requiresPasswordChange;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.requiresPasswordChange = token.requiresPasswordChange;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login', // Default sign in
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_do_not_use_in_production",
};
