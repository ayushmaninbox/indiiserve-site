"use client";

import { useState, FormEvent, useEffect } from "react";

interface EnquiryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function EnquiryModal({ isOpen, onClose }: EnquiryModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('hide-cursor-trail');
        } else {
            document.body.classList.remove('hide-cursor-trail');
        }
        return () => document.body.classList.remove('hide-cursor-trail');
    }, [isOpen]);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        service: "",
        budget: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await fetch("/api/enquiries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            setIsSubmitting(false);
            setIsSubmitted(true);

            setTimeout(() => {
                setIsSubmitted(false);
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    company: "",
                    service: "",
                    budget: "",
                    message: "",
                });
                onClose();
            }, 2500);
        } catch (error) {
            console.error("Failed to submit enquiry:", error);
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-[2.5rem] border border-white/5 bg-[#0a0a0a]/95 backdrop-blur-3xl p-6 sm:p-12 shadow-[0_0_100px_rgba(139,92,246,0.15)] custom-scrollbar">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2.5 rounded-xl bg-white/5 border border-white/5 text-neutral-400 hover:text-white hover:bg-white/10 transition-all z-20 group"
                >
                    <svg className="h-5 w-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {isSubmitted ? (
                    <div className="py-20 text-center animate-in fade-in zoom-in duration-500">
                        <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-500/10 border border-violet-500/20 shadow-[0_0_40px_rgba(139,92,246,0.2)]">
                            <svg className="h-10 w-10 text-violet-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-3xl font-bold text-white tracking-tight">Signal Received.</h3>
                        <p className="mt-4 text-neutral-400 font-medium tracking-wide">Our strategists will connect with you shortly.</p>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="mb-12 text-center">
                            <h2 className="text-3xl font-bold text-white sm:text-4xl tracking-tight leading-tight">
                                Start Your <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent italic">Journey</span>
                            </h2>
                            <p className="mt-3 text-sm text-neutral-400 font-medium tracking-wide">
                                Tell us about your vision and objectives.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] ml-1">Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-2xl border border-white/5 bg-white/[0.03] px-6 py-4 text-sm font-bold text-white placeholder-neutral-700 outline-none transition-all focus:border-violet-500/50 focus:ring-8 focus:ring-violet-500/5"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] ml-1">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-2xl border border-white/5 bg-white/[0.03] px-6 py-4 text-sm font-bold text-white placeholder-neutral-700 outline-none transition-all focus:border-violet-500/50 focus:ring-8 focus:ring-violet-500/5"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] ml-1">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full rounded-2xl border border-white/5 bg-white/[0.03] px-6 py-4 text-sm font-bold text-white placeholder-neutral-700 outline-none transition-all focus:border-violet-500/50 focus:ring-8 focus:ring-violet-500/5"
                                        placeholder="+91 98747 09182"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] ml-1">Company</label>
                                    <input
                                        type="text"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        className="w-full rounded-2xl border border-white/5 bg-white/[0.03] px-6 py-4 text-sm font-bold text-white placeholder-neutral-700 outline-none transition-all focus:border-violet-500/50 focus:ring-8 focus:ring-violet-500/5"
                                        placeholder="Your organization"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] ml-1">Service *</label>
                                    <select
                                        name="service"
                                        value={formData.service}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-2xl border border-white/5 bg-white/[0.03] px-6 py-4 text-sm font-bold text-white outline-none transition-all focus:border-violet-500/50 focus:ring-8 focus:ring-violet-500/5 appearance-none"
                                    >
                                        <option value="" className="bg-[#0a0a0a]">Select a service</option>
                                        <option value="web-development" className="bg-[#0a0a0a]">Web Development</option>
                                        <option value="mobile-app" className="bg-[#0a0a0a]">Mobile App</option>
                                        <option value="ui-ux-design" className="bg-[#0a0a0a]">UI/UX Design</option>
                                        <option value="branding" className="bg-[#0a0a0a]">Branding</option>
                                        <option value="consulting" className="bg-[#0a0a0a]">Consulting</option>
                                        <option value="other" className="bg-[#0a0a0a]">Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] ml-1">Budget</label>
                                    <select
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleChange}
                                        className="w-full rounded-2xl border border-white/5 bg-white/[0.03] px-6 py-4 text-sm font-bold text-white outline-none transition-all focus:border-violet-500/50 focus:ring-8 focus:ring-violet-500/5 appearance-none"
                                    >
                                        <option value="" className="bg-[#0a0a0a]">Select budget range</option>
                                        <option value="10k-30k" className="bg-[#0a0a0a]">₹10,000 - ₹30,000</option>
                                        <option value="30k-1l" className="bg-[#0a0a0a]">₹30,000 - ₹1,00,000</option>
                                        <option value="1l-5l" className="bg-[#0a0a0a]">₹1,00,000 - ₹5,00,000</option>
                                        <option value="5l+" className="bg-[#0a0a0a]">₹5,00,000+</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] ml-1">Message *</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={4}
                                    className="w-full resize-none rounded-2xl border border-white/5 bg-white/[0.03] px-6 py-4 text-sm font-bold text-white placeholder-neutral-700 outline-none transition-all focus:border-violet-500/50 focus:ring-8 focus:ring-violet-500/5"
                                    placeholder="Tell us about your project aims..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-600 to-purple-600 py-5 font-bold text-xs uppercase tracking-[0.2em] text-white transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_0_40px_rgba(139,92,246,0.3)] disabled:opacity-50"
                            >
                                {isSubmitting ? "Transmitting..." : "Initiate Connection"}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
