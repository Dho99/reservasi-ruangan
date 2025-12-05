import type { Metadata } from "next";
import { Rajdhani } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Sistem Reservasi Ruangan",
  description: "Aplikasi Peminjaman Ruangan Kampus",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${rajdhani.variable} antialiased`}>
        <SessionProvider>
          {children}
        </SessionProvider>
        <Toaster position="top-right" richColors/>
      </body>
    </html>
  );
}


