import Link from "next/link";
import { Linkedin, Instagram, Facebook } from "lucide-react";

const siteLinks = [
    { href: "#hero", label: "Home" },
    { href: "#services", label: "Services" },
    { href: "/work", label: "Work" },
    { href: "/about", label: "About" },
];

const serviceLinks = [
    { href: "/services/digital-branding", label: "Digital Branding" },
    { href: "/services/ai-automation", label: "AI & Automation" },
    { href: "/services/recruitment", label: "Recruitment" },
    { href: "/services", label: "All Services" },
];


export default function Footer() {
    return (
        <footer className="relative pt-20 pb-10 bg-[#030014] text-white border-t border-violet-500/20">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-violet-900/10 via-transparent to-transparent pointer-events-none" />

            <div className="relative max-w-[1400px] mx-auto px-5 md:px-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-20 mb-20">
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-3"
                        >
                            <img src="/white_logo.png" alt="InDiiServe.ai" className="h-10 w-auto" />
                            <span style={{ fontFamily: 'Poppins, sans-serif' }} className="text-3xl font-bold text-white">
                                InDiiServe.ai
                            </span>
                        </Link>
                        <p className="text-base opacity-50 max-w-[250px]">
                            Transforming businesses through data-driven digital excellence.
                        </p>
                        <div className="flex gap-4 pt-2">
                            {[
                                { name: 'LinkedIn', icon: <Linkedin className="w-4 h-4" />, href: 'https://www.linkedin.com/company/indiiserve-ai/' },
                                { name: 'Instagram', icon: <Instagram className="w-4 h-4" />, href: 'https://www.instagram.com/indiiserve.ai/' },
                                { name: 'Facebook', icon: <Facebook className="w-4 h-4" />, href: 'https://www.facebook.com/InDiiServe.ai' }
                            ].map((social) => (
                                <Link
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="no-cursor w-10 h-10 rounded-full border border-violet-500/30 flex items-center justify-center hover:bg-gradient-to-r hover:from-indigo-500 hover:to-violet-500 hover:border-transparent transition-all duration-300"
                                    aria-label={social.name}
                                >
                                    <span className="sr-only">{social.name}</span>
                                    {social.icon}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Site Index */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-8 text-violet-400">
                            Menu
                        </h4>
                        <ul className="space-y-3">
                            {siteLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="no-cursor text-sm opacity-60 hover:opacity-100 hover:translate-x-1 hover:text-violet-400 transition-all inline-block"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-8 text-violet-400">
                            Services
                        </h4>
                        <ul className="space-y-3">
                            {serviceLinks.map((link, idx) => (
                                <li key={idx}>
                                    <Link
                                        href={link.href}
                                        className="no-cursor text-sm opacity-60 hover:opacity-100 hover:translate-x-1 hover:text-violet-400 transition-all inline-block"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-8 text-violet-400">
                            Newsletter
                        </h4>
                        <p className="text-sm opacity-50 mb-6">
                            Insights directly to your inbox.
                        </p>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="no-cursor flex-1 bg-white/5 border border-violet-500/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                            />
                            <button
                                type="submit"
                                className="no-cursor bg-gradient-to-r from-indigo-500 to-violet-500 text-white px-4 py-3 rounded-lg font-medium hover:from-indigo-400 hover:to-violet-400 transition-all"
                                aria-label="Subscribe"
                            >
                                →
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-8 border-t border-violet-500/10">
                    <div className="flex flex-col md:flex-row justify-between items-center text-[10px] sm:text-xs text-white/80 uppercase tracking-[0.2em] gap-4 mb-6">
                        <p className="font-semibold text-white/90">&copy; 2026 InDiiServe.ai. All rights reserved.</p>
                        <div className="flex gap-8">
                            <Link href="/privacy" className="no-cursor hover:text-violet-400 transition-colors">Privacy Policy</Link>
                            <Link href="/terms" className="no-cursor hover:text-violet-400 transition-colors">Terms of Service</Link>
                        </div>
                    </div>
                    {/* Legal Info */}
                    <div className="flex flex-col md:flex-row justify-between items-center text-[10px] sm:text-xs text-white uppercase tracking-[0.2em] gap-3 text-center md:text-left pt-6 border-t border-white/10">
                        <p className="font-bold text-violet-400 shadow-[0_0_20px_rgba(167,139,250,0.15)]">INDIISERVE SOLUTIONS PRIVATE LIMITED</p>
                        <div className="flex flex-col md:flex-row gap-3 md:gap-8">
                            <span className="flex items-center gap-1.5"><span className="text-violet-400 font-bold">CIN:</span> <span className="text-white">U82990WB2025PTC283844</span></span>
                            <span className="flex items-center gap-1.5"><span className="text-violet-400 font-bold">GST NO:</span> <span className="text-white">[PENDING]</span></span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
