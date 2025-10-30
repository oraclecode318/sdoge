import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "sDOGE - Stake and Earn",
  description: "sDOGE - The future of decentralized staking",
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
