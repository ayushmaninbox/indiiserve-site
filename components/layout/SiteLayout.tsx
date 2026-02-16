"use client";

import { usePathname } from "next/navigation";
import { useLoader } from "@/context/LoaderContext";
import { useEffect } from "react";
import { Navbar, Footer } from "@/components/layout";
import { PageLoader, CustomCursor, SmoothScroll } from "@/components/ui";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    const { isLoading, setIsLoading } = useLoader();
    const pathname = usePathname();
    const isHomePage = pathname === "/";

    useEffect(() => {
        if (!isHomePage) {
            setIsLoading(false);
        }
    }, [pathname, isHomePage, setIsLoading]);

    // Don't apply site layout to admin pages
    const isAdminPage = pathname.startsWith("/admin");

    if (isAdminPage) {
        return <>{children}</>;
    }

    return (
        <SmoothScroll>
            {isHomePage && <PageLoader />}
            <CustomCursor />

            {/* Render content immediately if not homepage, or wait for loader if homepage */}
            {(!isLoading || !isHomePage) && (
                <>
                    <Navbar />
                    {children}
                    <Footer />
                </>
            )}
        </SmoothScroll>
    );
}
