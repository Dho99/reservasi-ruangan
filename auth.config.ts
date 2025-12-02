import type { NextAuthConfig } from "next-auth"
import { CredentialsSignin } from "next-auth"
import Google from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcrypt-ts"
import { findUserByEmail } from "./lib/utils/auth"


class InvalidLoginError extends CredentialsSignin {
  code = "Invalid identifier or password";
}

class UserNotFoundError extends CredentialsSignin {
  code = "User not found";
}

// Notice this is only an object, not a full Auth.js instance
export default {
    providers: [
    // --- GOOGLE PROVIDER (Support Gmail & Email Kampus) ---
    Google({
      authorization: {
        params: {
          // Memaksa Google selalu menampilkan layar pilih akun
          prompt: "select_account", 
        },
      },
      async profile(profile) {
        const email = profile.email?.toLowerCase();
        
        // Tentukan role berdasarkan email
        let role: "ADMIN" | "MAHASISWA" = "MAHASISWA";
        
        // Admin: email kampus staff (@unsil.ac.id tapi bukan @student.unsil.ac.id)
        if (email?.endsWith("@unsil.ac.id") && !email?.includes("@student.")) {
          role = "ADMIN";
        }
        // Mahasiswa: @student.unsil.ac.id atau @gmail.com
        else if (email?.endsWith("@student.unsil.ac.id") || email?.endsWith("@gmail.com")) {
          role = "MAHASISWA";
        }
        
        const user = {
          id: profile.sub,
          nama: profile.name,
          email: profile.email,
          role: role,
          image: profile.picture,
        };

        console.log(`🔐 Google Profile: ${user.email} - Role: ${user.role}`);
        return user;
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if(!credentials?.email || !credentials?.password) {
           throw new InvalidLoginError()
        }

        const user = await findUserByEmail(credentials.email as string);

        if(!user) {
              throw new UserNotFoundError();
        }

        const isPasswordValid = await compare(credentials.password as string, user.password as string)
        
        if(!isPasswordValid) {
           throw new InvalidLoginError();
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role
        };
      }
      
    })
  ],
} satisfies NextAuthConfig