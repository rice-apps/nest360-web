import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { site } from "@/lib/data/site";
import "./globals.css";

// Site font. Change it here (and the weights you need); globals.css picks it
// up as the default font through --font-brand.
const brandFont = Poppins({
  variable: "--font-brand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: site.name,
  description: site.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${brandFont.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Header />
        {/* flex-1 keeps the footer at the bottom even on short pages. */}
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
