import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LoaderProvider } from "@/context/LoaderContext";
import SiteLayout from "@/components/layout/SiteLayout";
import FloatingGradients from "@/components/ui/FloatingGradients";

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
  title: "InDiiServe | Digital Marketing Consultancy",
  description:
    "Transform your business with InDiiServe. We provide cutting-edge digital marketing consultancy services that leverage data-driven strategies and innovative campaigns.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${migra.variable} antialiased selection:bg-violet-500 selection:text-white font-migra bg-black`}>
        <FloatingGradients />
        <LoaderProvider>
          <SiteLayout>
            {children}
          </SiteLayout>
        </LoaderProvider>
      </body>
    </html>
  );
}

