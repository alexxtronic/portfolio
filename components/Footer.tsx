"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative py-16 md:py-24 border-t border-brand-white/5">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                    {/* Brand */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link
                            href="/"
                            className="font-[family-name:var(--font-cormorant)] text-2xl text-brand-white tracking-tight"
                        >
                            Alexander <span className="italic">D&apos;Amore</span>
                        </Link>
                        <p className="mt-4 text-sm text-brand-white/50 max-w-xs">
                            AI & Marketing Specialist building automation systems that turn
                            noise into pipeline.
                        </p>
                    </motion.div>

                    {/* Navigation */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <h4 className="text-xs uppercase tracking-widest text-brand-white/30 mb-4">
                            Navigation
                        </h4>
                        <div className="flex flex-col gap-3">
                            {[
                                { name: "Home", href: "/" },
                                { name: "Work", href: "/work" },
                                { name: "Blog", href: "/blog" },
                                { name: "Contact", href: "/contact" },
                            ].map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-sm text-brand-white/50 hover:text-brand-white transition-colors"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>

                    {/* Connect */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h4 className="text-xs uppercase tracking-widest text-brand-white/30 mb-4">
                            Connect
                        </h4>
                        <div className="flex gap-4">
                            <a
                                href="https://www.linkedin.com/in/alexdamore/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative w-12 h-12 flex items-center justify-center"
                                aria-label="LinkedIn"
                            >
                                <Image
                                    src="/assets/images/linkedin-icon.png"
                                    alt="LinkedIn"
                                    width={48}
                                    height={48}
                                    className="object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                                />
                            </a>
                            <a
                                href="mailto:alexdamore2@gmail.com"
                                className="group relative w-12 h-12 flex items-center justify-center"
                                aria-label="Email"
                            >
                                <Image
                                    src="/assets/images/email-icon.png"
                                    alt="Email"
                                    width={48}
                                    height={48}
                                    className="object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                                />
                            </a>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="pt-8 border-t border-brand-white/5 flex flex-col md:flex-row justify-between items-center gap-4"
                >
                    <p className="text-xs text-brand-white/30 uppercase tracking-widest">
                        &copy; {currentYear} Alexander D&apos;Amore. All rights reserved.
                    </p>
                    <p className="text-xs text-brand-white/20">
                        Built with Next.js, Tailwind & Framer Motion
                    </p>
                </motion.div>
            </div>
        </footer>
    );
}

export default Footer;
