"use client";

import { useLoader } from "@/context/LoaderContext";
import { Navbar, Footer } from "@/components/layout";
import { PageLoader, CustomCursor, SmoothScroll } from "@/components/ui";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    const { isLoading } = useLoader();

    return (
        <SmoothScroll>
            <PageLoader />
            <CustomCursor />

            {/* 
              Conditionally render content:
              User wanted the loader to be a "separate page".
              We keep the content UNMOUNTED until loading completes (triggered by PageLoader).
              This ensures animations (Hero, etc.) start fresh when revealed.
            */}
            {!isLoading && (
                <>
                    <Navbar />
                    {children}
                    <Footer />
                </>
            )}
        </SmoothScroll>
    );
}
