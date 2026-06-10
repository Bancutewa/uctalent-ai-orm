import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { LanguageProvider } from "@/lib/language-context";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI ORM Dashboard",
  description: "Manage your reviews with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LanguageProvider>
      <html
        lang="en"
        className={`${inter.variable} ${geistMono.variable} h-full antialiased dark`}
        suppressHydrationWarning
      >
        <body className="min-h-full flex flex-col bg-background text-foreground" suppressHydrationWarning>
          <Header />
          {children}
          <Toaster richColors position="top-right" />
        </body>
      </html>
    </LanguageProvider>
  );
}
