import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/db";
import AdminUser from "@/models/AdminUser";
import School from "@/models/School";
import bcrypt from "bcryptjs";

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
        let referralCode = user?.referralCode;

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
            referralCode = undefined;
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
          referralCode: referralCode,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // 1. Initial Login: store initial data
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.requiresPasswordChange = user.requiresPasswordChange;
        token.referralCode = user.referralCode;
        token.lastRefetchedAt = Math.floor(Date.now() / 1000);
      } 
      
      // 2. Allow manual refresh via update() if needed
      else if (trigger === "update" && session) {
        token.role = session.user?.role || token.role;
        token.lastRefetchedAt = Math.floor(Date.now() / 1000);
      }

      // 3. Periodic/Subsequent calls: Throttled re-validation (e.g. every 30 minutes)
      // This is triggered by navigation or refetchOnWindowFocus from the client SessionProvider
      else if (token.id) {
        const now = Math.floor(Date.now() / 1000);
        const lastRefetched = (token.lastRefetchedAt as number) || 0;
        
        // Only hit the DB if 30 minutes (1800s) have passed since the last fetch
        // Or if we don't have a timestamp yet
        if (now - lastRefetched > 1800) {
          try {
            await dbConnect();
            const admin = await AdminUser.findById(token.id);
            if (admin) {
              if (!admin.isActive) {
                return { ...token, error: "AccountInactive" };
              }
              token.role = admin.role;
              token.requiresPasswordChange = admin.requiresPasswordChange;
              token.lastRefetchedAt = now;
            } else {
              // Check if it's a school owner
              const school = await School.findById(token.id);
              if (school) {
                token.role = "school_owner";
                token.lastRefetchedAt = now;
              }
            }
          } catch (error) {
            console.error("JWT Session re-validation failed:", error);
            // On DB failure, we might want to return the stale token and try again next time
          }
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token.error === "AccountInactive") {
          return null as any; 
      }
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.requiresPasswordChange = token.requiresPasswordChange;
        session.user.referralCode = token.referralCode;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login', // Default sign in
  },
  session: {
    strategy: "jwt",
    maxAge: 365 * 24 * 60 * 60, // 1 year persistence (long lived token)
    updateAge: 30 * 60, // Throttle cookie writes to once every 30 minutes (refresh logic)
  },
  secret: process.env.NEXTAUTH_SECRET,
};

if (!process.env.NEXTAUTH_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("NEXTAUTH_SECRET is not set in production environment");
}
