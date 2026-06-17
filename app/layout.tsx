import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Ronith J Salian | Portfolio",
  description: "Cinematic futuristic developer portfolio of Ronith J Salian, a Computer Science student and Full Stack Developer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-bg-space text-text-primary`}>
        {children}
        <Footer />
      </body>
    </html>
  );
}
