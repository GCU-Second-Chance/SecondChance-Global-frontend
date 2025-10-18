import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics, GoogleTagManager } from "@/lib/analytics";
import { I18nProvider } from "@/lib/i18n";
import { QueryProvider } from "@/lib/react-query";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SecondChance Global - Giving Second Chances to Rescue Dogs",
  description:
    "Help rescue dogs find their forever homes through our global sharing platform and photo challenge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased `}>
        <GoogleTagManager />
        <GoogleAnalytics />
        <I18nProvider>
          <QueryProvider>{children}</QueryProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
