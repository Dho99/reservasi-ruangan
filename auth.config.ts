import type { NextAuthConfig } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcrypt-ts"
import { findUserByEmail } from "./lib/utils/auth"

// Notice this is only an object, not a full Auth.js instance
export default {
    providers: [
    // --- GOOGLE PROVIDER (Dengan Pembatasan Domain) ---
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // KONFIGURASI TAMBAHAN PENTING:
      authorization: {
        params: {
          // 'hd' (hosted domain): Meminta Google membatasi UI login hanya untuk domain ini.
          // User tidak akan melihat opsi login dengan Gmail pribadi mereka.
          hd: "unsil.ac.id", 
          // 'prompt': Memaksa Google selalu menampilkan layar pilih akun (opsional)
          prompt: "select_account", 
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Cari user di database
        const user = await findUserByEmail(credentials.email as string)

        if (!user || !user.password) {
          return null
        }

        // Validasi password (hash)
        const isPasswordValid = await compare(credentials.password as string, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.nama,
          role: user.role, 
        }
      }
    })
  ],
} satisfies NextAuthConfig