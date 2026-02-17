import type { Metadata } from "next";
import localFont from "next/font/local";
import { Poppins } from "next/font/google";
import "./globals.css";
import { LoaderProvider } from "@/context/LoaderContext";
import { EnquiryProvider } from "@/context/EnquiryContext";
import SiteLayout from "@/components/layout/SiteLayout";
import FloatingGradients from "@/components/ui/FloatingGradients";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

const migra = localFont({
  src: [
    {
      path: "../public/fonts/Migra-Extralight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/Migra-Extralight.woff",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/Migra-Extralight.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Migra-Extralight.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/MigraItalic-ExtralightItalic.woff2",
      weight: "200",
      style: "italic",
    },
    {
      path: "../public/fonts/Migra-Extrabold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/Migra-Extrabold.woff",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/MigraItalic-ExtraboldItalic.woff2",
      weight: "800",
      style: "italic",
    },
  ],
  variable: "--font-migra",
  display: "swap",
});

export const metadata: Metadata = {
  title: "InDiiServe.ai | Strategic Consulting",
  description:
    "Transform your business with InDiiServe.ai. We provide cutting-edge strategic consulting services that leverage data-driven strategies and innovative campaigns.",
  icons: {
    icon: "/white_logo.png",
    shortcut: "/white_logo.png",
    apple: "/white_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${migra.variable} ${poppins.variable} antialiased selection:bg-violet-500 selection:text-white font-migra bg-black`}>
        <FloatingGradients />
        <LoaderProvider>
          <EnquiryProvider>
            <SiteLayout>
              {children}
            </SiteLayout>
          </EnquiryProvider>
        </LoaderProvider>
      </body>
    </html>
  );
}

