"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, Linkedin, Send, CheckCircle, AlertCircle } from "lucide-react";

type FormStatus = "idle" | "submitting" | "success" | "error";

export function ContactPageClient() {
    const [status, setStatus] = useState<FormStatus>("idle");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setStatus("submitting");

        try {
            // Formspree endpoint - Replace YOUR_FORM_ID with your actual Formspree form ID
            const response = await fetch("https://formspree.io/f/xgvkbwpv", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    message: formData.message,
                }),
            });

            if (response.ok) {
                setStatus("success");
                setFormData({ name: "", email: "", message: "" });
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        }
    };

    return (
        <main className="min-h-screen pt-32 pb-24">
            <div className="container mx-auto px-6">
                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mb-12"
                >
                    <span className="font-[family-name:var(--font-cormorant)] text-xs uppercase tracking-[0.3em] text-brand-blue mb-4 block">
                        Get in Touch
                    </span>
                    <h1 className="font-[family-name:var(--font-cormorant)] text-5xl md:text-6xl lg:text-7xl mb-6">
                        Let&apos;s <span className="italic text-brand-white/60">talk</span>
                    </h1>
                    <p className="text-lg text-brand-white/60 max-w-xl">
                        Have a project in mind? Need help with marketing automation or AI
                        integration? I&apos;d love to hear from you.
                    </p>
                </motion.div>

                {/* Unified Card Background */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="p-8 md:p-12 rounded-3xl bg-brand-white/5 backdrop-blur-xl border border-brand-white/10"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            {/* Email */}
                            <div>
                                <h3 className="text-xs uppercase tracking-widest text-brand-white/30 mb-4">
                                    Email
                                </h3>
                                <a
                                    href="mailto:alexdamore2@gmail.com"
                                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-brand-white/5 transition-colors group"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-brand-blue/20 flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-brand-blue" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-brand-white group-hover:text-brand-blue transition-colors">
                                            alexdamore2@gmail.com
                                        </p>
                                        <p className="text-sm text-brand-white/50">
                                            Best for project inquiries
                                        </p>
                                    </div>
                                </a>
                            </div>

                            {/* LinkedIn */}
                            <div>
                                <h3 className="text-xs uppercase tracking-widest text-brand-white/30 mb-4">
                                    LinkedIn
                                </h3>
                                <a
                                    href="https://www.linkedin.com/in/alexdamore/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-brand-white/5 transition-colors group"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-brand-blue/20 flex items-center justify-center">
                                        <Linkedin className="w-5 h-5 text-brand-blue" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-brand-white group-hover:text-brand-blue transition-colors">
                                            linkedin.com/in/alexdamore
                                        </p>
                                        <p className="text-sm text-brand-white/50">
                                            Connect with me
                                        </p>
                                    </div>
                                </a>
                            </div>

                            {/* Availability */}
                            <div className="pt-6 border-t border-brand-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-sm text-brand-white/50">
                                        Currently available for projects
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div>
                            {status === "success" ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="h-full flex flex-col items-center justify-center text-center p-8 rounded-2xl bg-brand-black/30 border border-brand-white/10"
                                >
                                    <div className="w-16 h-16 mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                                        <CheckCircle className="w-8 h-8 text-green-500" />
                                    </div>
                                    <h3 className="font-[family-name:var(--font-cormorant)] text-2xl mb-3">
                                        Message Sent!
                                    </h3>
                                    <p className="text-brand-white/60 mb-6">
                                        Thanks for reaching out! I&apos;ll get back to you as soon as possible.
                                    </p>
                                    <button
                                        onClick={() => setStatus("idle")}
                                        className="inline-flex items-center gap-2 text-brand-blue hover:underline"
                                    >
                                        Send another message →
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Name */}
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-xs uppercase tracking-widest text-brand-white/50 mb-2"
                                        >
                                            Name
                                        </label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData({ ...formData, name: e.target.value })
                                            }
                                            className="w-full bg-brand-black/50 border border-brand-white/10 rounded-xl px-5 py-4 text-brand-white placeholder:text-brand-white/30 focus:outline-none focus:border-brand-blue/50 transition-colors"
                                            placeholder="Your name"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-xs uppercase tracking-widest text-brand-white/50 mb-2"
                                        >
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) =>
                                                setFormData({ ...formData, email: e.target.value })
                                            }
                                            className="w-full bg-brand-black/50 border border-brand-white/10 rounded-xl px-5 py-4 text-brand-white placeholder:text-brand-white/30 focus:outline-none focus:border-brand-blue/50 transition-colors"
                                            placeholder="your@email.com"
                                        />
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label
                                            htmlFor="message"
                                            className="block text-xs uppercase tracking-widest text-brand-white/50 mb-2"
                                        >
                                            Message
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            required
                                            rows={5}
                                            value={formData.message}
                                            onChange={(e) =>
                                                setFormData({ ...formData, message: e.target.value })
                                            }
                                            className="w-full bg-brand-black/50 border border-brand-white/10 rounded-xl px-5 py-4 text-brand-white placeholder:text-brand-white/30 focus:outline-none focus:border-brand-blue/50 transition-colors resize-none"
                                            placeholder="Tell me about your project..."
                                        />
                                    </div>

                                    {/* Error message */}
                                    {status === "error" && (
                                        <div className="flex items-center gap-2 text-red-400 text-sm">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>Something went wrong. Please try again.</span>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={status === "submitting"}
                                        className="w-full flex items-center justify-center gap-3 px-8 py-4 text-sm font-semibold text-brand-white uppercase tracking-widest bg-brand-blue/30 hover:bg-brand-blue/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-full border border-brand-blue/40"
                                    >
                                        {status === "submitting" ? (
                                            <>
                                                <span className="w-4 h-4 border-2 border-brand-white/30 border-t-brand-white rounded-full animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                Send Message
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}

export default ContactPageClient;
