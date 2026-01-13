"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import GlassSurface from "./GlassSurface";

export function CTASection() {
    return (
        <section className="relative py-24 md:py-32 overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/10 via-transparent to-transparent pointer-events-none" />

            {/* Ambient glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-blue/20 blur-[150px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto text-center"
                >
                    {/* Headline */}
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-6"
                    >
                        Want to build something{" "}
                        <span className="italic text-brand-blue">next-level</span>?
                    </motion.h2>

                    {/* Subtext */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="text-lg md:text-xl text-brand-white/50 mb-10 max-w-2xl mx-auto"
                    >
                        Let&apos;s turn your marketing chaos into an automated system that
                        scales.
                    </motion.p>

                    {/* CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                    >
                        <GlassSurface
                            borderRadius={9999}
                            borderWidth={0.1}
                            brightness={70}
                            opacity={0.8}
                            blur={12}
                            backgroundOpacity={0.2}
                            distortionScale={-150}
                            width="auto"
                            height="auto"
                            className="inline-block"
                        >
                            <Link
                                href="/contact"
                                className="inline-flex items-center px-10 py-5 text-base font-semibold text-brand-white uppercase tracking-widest bg-brand-blue/30 hover:bg-brand-blue/40 transition-colors rounded-full border border-brand-blue/40 group"
                            >
                                Let&apos;s Chat
                                <motion.span
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="ml-3"
                                >
                                    →
                                </motion.span>
                            </Link>
                        </GlassSurface>
                    </motion.div>

                    {/* Decorative elements */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                        className="mt-16 flex justify-center gap-8"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs uppercase tracking-widest text-brand-white/30">
                                Available for projects
                            </span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}

export default CTASection;
