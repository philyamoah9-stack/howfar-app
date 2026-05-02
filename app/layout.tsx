import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "How Far? — Track your life. Grow on purpose.",
  description:
    "The personal growth platform for Ghanaian and African professionals. Track your money, your habits, your mind, your purpose — all in one place.",
  metadataBase: new URL("https://yourhowfar.com"),
  openGraph: {
    title: "How Far? — Track your life. Grow on purpose.",
    description:
      "The personal growth platform for Ghanaian and African professionals.",
    url: "https://yourhowfar.com",
    siteName: "How Far?",
    locale: "en_GH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "How Far? — Track your life. Grow on purpose.",
    description:
      "The personal growth platform for Ghanaian and African professionals.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#d4a947" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="How Far?" />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}