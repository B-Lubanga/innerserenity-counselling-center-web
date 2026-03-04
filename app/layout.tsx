import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ScrollToTop from "@/components/scroll-to-top"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Inner Serenity Counselling Centre | Professional Counselling Services",
  description: "Professional counselling services to help you discover peace and balance in your life. Book sessions, chat with counsellors, and access mental health resources.",
  keywords: ["counselling", "therapy", "mental health", "inner serenity", "counsellor"],
  authors: [{ name: "Inner Serenity Counselling Centre" }],
  openGraph: {
    title: "Inner Serenity Counselling Centre",
    description: "Professional counselling services to help you discover peace and balance in your life",
    type: "website",
    url: "https://innerserenity.com",
  },
    generator: 'v0.app'
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#a7d8c8",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ScrollToTop />
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
