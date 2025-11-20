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
  // 1. Hubungkan dengan Database via Prisma Adapter
  adapter: PrismaAdapter(prisma),
  ...authConfig,
  
  // 2. Strategi Sesi: Gunakan JWT untuk performa (stateless)
  session: {
    strategy: "jwt",
  },

  // 3. Definisi Provider


  // 4. Callbacks: Logika Validasi & Manipulasi Sesi
  callbacks: {
    // --- GATEKEEPER UTAMA (Server-Side Validation) ---
    // Callback ini berjalan tepat setelah user login di Google, tapi SEBELUM sesi dibuat.
    async signIn({ user, account, profile }) {
      
      // Validasi ketat: Hanya izinkan email dengan akhiran domain yang benar
      const isAllowedDomain = user.email?.endsWith("@unsil.ac.id");

      if (!isAllowedDomain) {
        // Jika domain salah, tolak akses. User akan dilempar ke halaman error.
        console.warn(`Percobaan akses tidak sah dari: ${user.email}`);
        return false; 
      }
      
      return true; // Izinkan login/registrasi
    },

    // Memasukkan data Role & ID ke dalam Token JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role as "ADMIN" | "MAHASISWA"
      }
      return token
    },

    // Memasukkan data dari Token ke Sesi Client-Side
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as "ADMIN" | "MAHASISWA"
      }
      return session
    }
  },

  // 5. Halaman Kustom
  pages: {
    signIn: '/auth/login',
    error: '/auth/error', // Error (misal domain salah) akan diarahkan ke sini
  }
});