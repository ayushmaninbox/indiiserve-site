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
            <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-violet-500/20 bg-neutral-900/95 p-8 shadow-2xl">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white transition-colors"
                >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {isSubmitted ? (
                    <div className="py-16 text-center">
                        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/20">
                            <svg className="h-8 w-8 text-violet-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white">Thank You!</h3>
                        <p className="mt-2 text-neutral-400">We&apos;ll get back to you soon.</p>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="mb-8 text-center">
                            <h2 className="text-2xl font-bold text-white sm:text-3xl">
                                Start Your <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">Journey</span>
                            </h2>
                            <p className="mt-2 text-neutral-400">
                                Tell us about your project
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-neutral-300">Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 outline-none transition-all focus:border-violet-500/50"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-neutral-300">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 outline-none transition-all focus:border-violet-500/50"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-neutral-300">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 outline-none transition-all focus:border-violet-500/50"
                                        placeholder="+1 234 567 890"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-neutral-300">Company</label>
                                    <input
                                        type="text"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 outline-none transition-all focus:border-violet-500/50"
                                        placeholder="Your company"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-neutral-300">Service *</label>
                                    <select
                                        name="service"
                                        value={formData.service}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-all focus:border-violet-500/50"
                                    >
                                        <option value="" className="bg-neutral-900">Select a service</option>
                                        <option value="web-development" className="bg-neutral-900">Web Development</option>
                                        <option value="mobile-app" className="bg-neutral-900">Mobile App</option>
                                        <option value="ui-ux-design" className="bg-neutral-900">UI/UX Design</option>
                                        <option value="branding" className="bg-neutral-900">Branding</option>
                                        <option value="consulting" className="bg-neutral-900">Consulting</option>
                                        <option value="other" className="bg-neutral-900">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-neutral-300">Budget</label>
                                    <select
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-all focus:border-violet-500/50"
                                    >
                                        <option value="" className="bg-neutral-900">Select budget range</option>
                                        <option value="5k-10k" className="bg-neutral-900">$5,000 - $10,000</option>
                                        <option value="10k-25k" className="bg-neutral-900">$10,000 - $25,000</option>
                                        <option value="25k-50k" className="bg-neutral-900">$25,000 - $50,000</option>
                                        <option value="50k+" className="bg-neutral-900">$50,000+</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-neutral-300">Message *</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={4}
                                    className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 outline-none transition-all focus:border-violet-500/50"
                                    placeholder="Tell us about your project..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 py-4 font-bold text-white transition-all hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] disabled:opacity-50"
                            >
                                {isSubmitting ? "Sending..." : "Submit Enquiry"}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
