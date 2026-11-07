import type { Metadata } from "next";
import { DM_Sans, Geist, Geist_Mono, Poppins } from "next/font/google";
import { draftMode } from "next/headers";
import "./globals.css";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Figma design system: Poppins for headings, DM Sans for body text. Poppins loads only the weights the type
// scale uses (regular, semibold, bold), to keep downloads small.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // A page's own title becomes e.g. "Jobs | NEST360"
  title: { default: "NEST360", template: "%s | NEST360" },
  description: "Newborn Essential Solutions and Technologies",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {isDraftMode && (
          <div className="bg-amber-100 text-amber-900 text-sm text-center py-2">
            You&apos;re viewing a draft preview.{" "}
            <a href="/exit-preview" className="underline font-medium">Exit preview</a>
          </div>
        )}
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
