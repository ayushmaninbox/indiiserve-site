import Link from "next/link";

const siteLinks = [
    { href: "#hero", label: "Home" },
    { href: "#services", label: "Services" },
    { href: "#work", label: "Work" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" },
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
                            className="inline-block text-3xl font-bold bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent font-migra"
                        >
                            InDiiServe
                        </Link>
                        <p className="text-base opacity-50 max-w-[250px]">
                            Transforming businesses through data-driven digital excellence.
                        </p>
                        <div className="flex gap-4 pt-2">
                            {['LinkedIn', 'Twitter', 'Instagram'].map((social) => (
                                <Link
                                    key={social}
                                    href="#"
                                    className="no-cursor w-10 h-10 rounded-full border border-violet-500/30 flex items-center justify-center hover:bg-gradient-to-r hover:from-indigo-500 hover:to-violet-500 hover:border-transparent transition-all duration-300"
                                    aria-label={social}
                                >
                                    <span className="sr-only">{social}</span>
                                    <div className="w-4 h-4 bg-current rounded-sm" />
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
                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-violet-500/20 text-xs opacity-40 uppercase tracking-widest gap-4">
                    <p>&copy; 2026 InDiiServe. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link href="#" className="no-cursor hover:text-violet-400 transition-colors">Privacy Policy</Link>
                        <Link href="#" className="no-cursor hover:text-violet-400 transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
