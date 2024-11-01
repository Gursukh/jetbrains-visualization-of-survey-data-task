import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import MainContext from "./(components)/mainContext";

const font = Poppins({ subsets: ["latin"], weight: ["300", "500", "700"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <MainContext>
        <body className={`${font.className} antialiased`}>
          {children}
        </body>
      </MainContext>
    </html>
  );
}
