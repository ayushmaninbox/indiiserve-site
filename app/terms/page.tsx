"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.fromTo(containerRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
        );
    }, []);

    return (
        <main className="bg-[#030014] text-white pt-40 pb-20 min-h-screen">
            <div ref={containerRef} className="max-w-[800px] mx-auto px-5">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-violet-400 hover:text-white transition-colors mb-12 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <h1 className="text-4xl md:text-6xl font-bold font-migra mb-10">Terms & <span className="text-violet-500">Conditions</span></h1>

                <div className="space-y-8 opacity-70 leading-relaxed text-lg">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 font-migra">1. Introduction</h2>
                        <p>Welcome to InDiiServe. These Terms & Conditions govern your use of our website and services. By accessing or using our services, you agree to be bound by these terms.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 font-migra">2. Services</h2>
                        <p>InDiiServe provides digital branding, AI automation, and recruitment consulting services. We reserve the right to modify or discontinue any service at any time without notice.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 font-migra">3. Intellectual Property</h2>
                        <p>All content included on this site, such as text, graphics, logos, and images, is the property of InDiiServe or its content suppliers and is protected by international copyright laws.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 font-migra">4. Limitation of Liability</h2>
                        <p>InDiiServe will not be liable for any damages of any kind arising from the use of this site or from any information, content, materials, or services included on or otherwise made available to you through this site.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 font-migra">5. Changes to Terms</h2>
                        <p>We reserve the right to update these Terms & Conditions at any time. Your continued use of the site following the posting of changes constitutes your acceptance of such changes.</p>
                    </section>
                </div>
            </div>
        </main>
    );
}
