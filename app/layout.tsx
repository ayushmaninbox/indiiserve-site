import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LoaderProvider } from "@/context/LoaderContext";
import SiteLayout from "@/components/SiteLayout";

const migra = localFont({
  src: [
    {
      path: "../public/Assets/Migra-Extralight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/Assets/Migra-Extralight.woff",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/Assets/Migra-Extralight.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/Assets/Migra-Extralight.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/Assets/MigraItalic-ExtralightItalic.woff2",
      weight: "200",
      style: "italic",
    },
    {
      path: "../public/Assets/Migra-Extrabold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/Assets/Migra-Extrabold.woff",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/Assets/MigraItalic-ExtraboldItalic.woff2",
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
      <body className={`${migra.variable} antialiased selection:bg-[#C0FF00] selection:text-black font-migra`}>
        <LoaderProvider>
          <SiteLayout>
            {children}
          </SiteLayout>
        </LoaderProvider>
      </body>
    </html>
  );
}
