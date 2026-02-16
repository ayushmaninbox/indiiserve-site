"use client";

import { usePathname } from "next/navigation";
import { useLoader } from "@/context/LoaderContext";
import { useEffect } from "react";
import { Navbar, Footer } from "@/components/layout";
import { PageLoader, CustomCursor, SmoothScroll, EnquiryModal } from "@/components/ui";
import { useEnquiry } from "@/context/EnquiryContext";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    const { isLoading, setIsLoading } = useLoader();
    const pathname = usePathname();
    const isHomePage = pathname === "/";

    useEffect(() => {
        if (!isHomePage) {
            setIsLoading(false);
        }
    }, [pathname, isHomePage, setIsLoading]);

    const { isOpen, closeEnquiry } = useEnquiry();

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
                <div className="relative z-10">
                    <Navbar />
                    {children}
                    <Footer />
                    <EnquiryModal isOpen={isOpen} onClose={closeEnquiry} />
                </div>
            )}
        </SmoothScroll>
    );
}
