import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Image Viewer",
  description: "CMC Image Viewer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <header className="sticky top-0 h-10 bg-secondary"></header>

        {children}
      </body>
    </html>
  );
}
