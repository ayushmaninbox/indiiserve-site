"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface EnquiryContextType {
    isOpen: boolean;
    openEnquiry: () => void;
    closeEnquiry: () => void;
}

const EnquiryContext = createContext<EnquiryContextType | undefined>(undefined);

export function EnquiryProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    const openEnquiry = () => setIsOpen(true);
    const closeEnquiry = () => setIsOpen(false);

    return (
        <EnquiryContext.Provider value={{ isOpen, openEnquiry, closeEnquiry }}>
            {children}
        </EnquiryContext.Provider>
    );
}

export function useEnquiry() {
    const context = useContext(EnquiryContext);
    if (context === undefined) {
        throw new Error("useEnquiry must be used within an EnquiryProvider");
    }
    return context;
}
