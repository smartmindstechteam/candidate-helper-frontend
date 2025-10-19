import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Somaliland Candidate Helper",
  description:
    "Empowering democratic participation through technology - A comprehensive platform for managing campaigns, supporters, and resources in Somaliland's democratic process.",
  keywords: [
    "Somaliland",
    "election",
    "campaign",
    "democracy",
    "politics",
    "voting",
    "management",
  ],
  authors: [{ name: "Somaliland Candidate Helper Team" }],
  openGraph: {
    title: "Somaliland Candidate Helper",
    description: "Empowering democratic participation through technology",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Somaliland Candidate Helper",
    description: "Empowering democratic participation through technology",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#22c55e" },
    { media: "(prefers-color-scheme: dark)", color: "#16a34a" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning suppressContentEditableWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          enableColorScheme
        >
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
