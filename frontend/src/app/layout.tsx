"use client";

import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Web3Provider } from "@/provider/Web3Context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Web3Provider>
          <ThemeProvider>
            <Navbar />
            {children}
          </ThemeProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
