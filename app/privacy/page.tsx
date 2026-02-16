"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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

                <h1 className="text-4xl md:text-6xl font-bold font-migra mb-10">Privacy <span className="text-violet-500">Policy</span></h1>

                <div className="space-y-8 opacity-70 leading-relaxed text-lg">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 font-migra">1. Information Collection</h2>
                        <p>We collect information you provide directly to us when you fill out an enquiry form or sign up for our newsletter. This may include your name, email address, phone number, and company details.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 font-migra">2. Use of Information</h2>
                        <p>We use the information we collect to provide, maintain, and improve our services, to communicate with you about your projects, and to send you insights and news if you have opted in.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 font-migra">3. Data Protection</h2>
                        <p>We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet is 100% secure.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 font-migra">4. Cookies</h2>
                        <p>We may use cookies to enhance your experience on our site. You can choose to set your web browser to refuse cookies, or to alert you when cookies are being sent.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 font-migra">5. Third-Party Links</h2>
                        <p>Our website may contain links to other sites. We are not responsible for the privacy practices or the content of such other websites.</p>
                    </section>
                </div>
            </div>
        </main>
    );
}
