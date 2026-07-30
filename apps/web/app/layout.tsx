import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aether OS — The Operating System for AI Creators",
  description: "Build full-stack web applications, landing pages, and AI products in minutes with Aether OS.",
  icons: {
    icon: "/logo.png?v=2",
    shortcut: "/logo.png?v=2",
    apple: "/logo.png?v=2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png?v=2" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png?v=2" />
      </head>
      <body className="bg-[#05070B] text-white antialiased selection:bg-white selection:text-black">
        {children}
      </body>
    </html>
  );
}
