import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stash",
  description: "Student Budgeting App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* This line below turns the lights off! */}
      <body className="antialiased bg-slate-950 text-slate-200">
        {children}
      </body>
    </html>
  );
}