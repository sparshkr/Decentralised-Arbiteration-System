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
      <Web3Provider>
        <body>
          <ThemeProvider>
            {/* <Navbar /> */}
            {/* {children} */}
            <Navbar>{children}</Navbar>
          </ThemeProvider>
        </body>
      </Web3Provider>
    </html>
  );
}
