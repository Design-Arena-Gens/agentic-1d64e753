import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Productivity Assistant",
  description: "Plan your day, prioritize tasks, and boost productivity with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
