import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma" // Pastikan Anda punya instance prisma client
import authConfig from "./auth.config"
import NextAuth from "next-auth"
import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface User {
    role?: "ADMIN" | "MAHASISWA"
  }
  
  interface Session {
    user: {
      id: string
      role: "ADMIN" | "MAHASISWA"
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    role?: "ADMIN" | "MAHASISWA"
  }
}


export const { handlers, signIn, signOut, auth } = NextAuth({
  // Note: Tidak menggunakan adapter karena JWT strategy
  // adapter: PrismaAdapter(prisma),
  ...authConfig,
  
  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user, account }) {
      // Validasi domain untuk Google OAuth
      if (account?.provider === "google") {
        const email = user.email?.toLowerCase();
        
        // STRICT: Hanya allow Email Kampus UNSIL
        const isUnsilEmail = email?.endsWith("unsil.ac.id");
        
        if (!isUnsilEmail) {
          console.warn(`❌ Percobaan login dengan email tidak valid: ${user.email}`);
          console.warn(`⚠️ Hanya email @unsil.ac.id atau @student.unsil.ac.id yang diperbolehkan`);
          return false; // TOLAK LOGIN
        }

        // Check if user exists in database, if not create one
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          });

          if (!existingUser) {
            // Create new user from Google profile
            const role = email?.endsWith("@unsil.ac.id") && !email?.includes("@student.") 
              ? "ADMIN" 
              : "MAHASISWA";

            await prisma.user.create({
              data: {
                email: user.email!,
                nama: user.name || "User",
                role: role,
                password: "", // Empty password for OAuth users
              }
            });
            console.log(`✅ User baru dibuat dari Google: ${user.email}`);
          } else {
            console.log(`✅ Login Google berhasil: ${user.email}`);
          }
        } catch (error) {
          console.error("Error checking/creating user:", error);
          return false;
        }
      }
      
      // Credentials provider tidak perlu validasi domain (sudah di database)
      return true;
    },

    // Memasukkan data Role & ID ke dalam Token JWT
    async jwt({ token, user, account }) {
      if (user) {
        // For OAuth, get user data from database
        if (account?.provider === "google") {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email! }
          });
          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role;
          }
        } else {
          // For credentials
          token.id = user.id;
          token.role = user.role as "ADMIN" | "MAHASISWA";
        }
      }
      return token;
    },

    // Memasukkan data dari Token ke Sesi Client-Side
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as "ADMIN" | "MAHASISWA"
      }
      return session
    },  

    async authorized({ auth }) {
      // Middleware akan memanggil callback ini untuk setiap request yang dilindungi.
      // Jika token tidak ada, tolak akses.
      if (!auth) {
        return false;
      }
      return true;
    }
  },

  // 5. Halaman Kustom
  pages: {
    signIn: '/',
    error: '/auth/error', // Error (misal domain salah) akan diarahkan ke sini
  }
});