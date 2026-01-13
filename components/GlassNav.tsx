"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import GlassSurface from "./GlassSurface";

const navItems = [
    { name: "Home", href: "/" },
    { name: "Work", href: "/work" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
];

export function GlassNav() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3 flex justify-center isolate">
            {/* Ambient glow for glass visibility */}
            <div className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-brand-blue/20 blur-[80px] rounded-full pointer-events-none -z-10" />

            <GlassSurface
                borderRadius={30}
                borderWidth={0.08}
                brightness={60}
                opacity={0.7}
                blur={16}
                displace={0.4}
                backgroundOpacity={0.15}
                saturation={0.6}
                distortionScale={-200}
                width="100%"
                height="auto"
                className="w-full max-w-7xl mx-auto"
            >
                <div className="flex items-center justify-between px-6 py-4 w-full">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="font-[family-name:var(--font-cormorant)] text-xl md:text-2xl text-brand-white tracking-tight hover:opacity-80 transition-opacity"
                    >
                        Alexander <span className="italic">D&apos;Amore</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-sm font-medium text-brand-white/70 hover:text-brand-white transition-colors uppercase tracking-widest"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Resume Button + Mobile Toggle */}
                    <div className="flex items-center gap-4">
                        <GlassSurface
                            borderRadius={9999}
                            borderWidth={0.1}
                            brightness={80}
                            opacity={0.9}
                            blur={10}
                            backgroundOpacity={0.3}
                            distortionScale={-150}
                            width="auto"
                            height="auto"
                            className="hidden md:block"
                        >
                            <a
                                href="/resume/alexander-damore-resume.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block px-6 py-2.5 text-xs font-bold text-brand-white uppercase tracking-widest bg-brand-red hover:bg-brand-red/80 transition-colors rounded-full animate-pulse-glow"
                            >
                                Resume
                            </a>
                        </GlassSurface>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden p-2 text-brand-white hover:text-brand-white/70 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </GlassSurface>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed top-20 left-4 right-4 z-50 md:hidden"
                    >
                        <GlassSurface
                            borderRadius={20}
                            borderWidth={0.08}
                            brightness={50}
                            opacity={0.95}
                            blur={20}
                            backgroundOpacity={0.9}
                            distortionScale={-200}
                            width="100%"
                            height="auto"
                            className="w-full"
                        >
                            <div className="flex flex-col p-6 gap-4">
                                {navItems.map((item, index) => (
                                    <motion.div
                                        key={item.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Link
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className="block text-lg font-medium text-brand-white hover:text-brand-blue transition-colors uppercase tracking-widest"
                                        >
                                            {item.name}
                                        </Link>
                                    </motion.div>
                                ))}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: navItems.length * 0.05 }}
                                    className="pt-4 border-t border-brand-white/10"
                                >
                                    <a
                                        href="/resume/alexander-damore-resume.pdf"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full py-3 text-center text-sm font-bold text-brand-white uppercase tracking-widest bg-brand-red hover:bg-brand-red/80 transition-colors rounded-full"
                                    >
                                        Resume
                                    </a>
                                </motion.div>
                            </div>
                        </GlassSurface>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

export default GlassNav;
