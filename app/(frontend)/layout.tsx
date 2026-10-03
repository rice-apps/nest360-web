import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// nest360.org's header and footer use Poppins.
const poppins = Poppins({
  variable: "--font-poppins-next",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "NEST360",
  description:
    "NEST360 works with governments in Africa to end preventable newborn deaths in hospitals.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        {/* flex-1 keeps the footer at the bottom even on short pages. */}
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
