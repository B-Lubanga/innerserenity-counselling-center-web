import type React from "react"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ScrollToTop from "@/components/scroll-to-top"
import FloatingChat from "@/components/floating-chat"

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500'],
})

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-heading',
  display: 'swap',
  weight: ['400', '600', '700'],
})

export const metadata = {
  title: "Inner Serenity Counselling Centre | Professional Counselling Services",
  description: "Professional counselling services to help you discover peace and balance in your life. Book sessions, chat with counsellors, and access mental health resources.",
  keywords: ["counselling", "therapy", "mental health", "inner serenity", "counsellor", "psychology", "wellness", "anxiety", "depression", "relationships"],
  authors: [{ name: "Inner Serenity Counselling Centre" }],
  creator: "Inner Serenity Counselling Centre",
  publisher: "Inner Serenity Counselling Centre",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://innerserenity.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Inner Serenity Counselling Centre",
    description: "Professional counselling services to help you discover peace and balance in your life",
    type: "website",
    url: "https://innerserenity.com",
    siteName: "Inner Serenity Counselling Centre",
    locale: "en_US",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Inner Serenity Counselling Centre",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Inner Serenity Counselling Centre",
    description: "Professional counselling services to help you discover peace and balance in your life",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#A5BE74",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfair.variable}`}>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <ScrollToTop />
            <Navbar />
            {children}
            <Footer />
            <FloatingChat />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
