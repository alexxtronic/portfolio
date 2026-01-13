"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Play, Pause } from "lucide-react";
import StarBorder from "./StarBorder";
import GradientText from "./GradientText";

export function HeroSection() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioExists, setAudioExists] = useState(true);
    const [audioError, setAudioError] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        // Check if audio file exists
        fetch("/audio/greeting.mp3", { method: "HEAD" })
            .then((res) => {
                if (!res.ok) {
                    setAudioExists(false);
                }
            })
            .catch(() => {
                setAudioExists(false);
            });
    }, []);

    const toggleAudio = () => {
        if (!audioExists) {
            setAudioError(true);
            return;
        }

        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleAudioEnd = () => {
        setIsPlaying(false);
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 md:pt-32">


            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left Column - Text */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="order-2 lg:order-1"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mb-8 text-left"
                        >
                            <GradientText
                                colors={["#ffffff", "#6366f1", "#ffffff"]}
                                animationSpeed={3.5}
                                yoyo={true}
                                className="font-[family-name:var(--font-cormorant)] text-7xl md:text-8xl lg:text-[9rem] leading-[0.9] tracking-tight mx-0 w-full justify-start backdrop-blur-none bg-transparent"
                            >
                                Hi, I&apos;m Alex
                            </GradientText>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.7 }}
                            className="font-[family-name:var(--font-cormorant)] text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] mb-6 text-left"
                        >
                            I turn{" "}
                            <span className="italic text-brand-blue">data</span>
                            <br />
                            into revenue.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-lg md:text-xl text-brand-white/60 max-w-xl mb-8 leading-relaxed text-left"
                        >
                            AI-first strategist architecting custom solutions that replace manual labor with autonomous code.
                            Scaled the Empire State Building&apos;s TikTok to 1.2M followers. Now leading AI integration for global brands.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="flex flex-wrap gap-4"
                        >
                            <StarBorder
                                as="button"
                                className="custom-class"
                                color="white"
                                speed="6s"
                            >
                                <Link
                                    href="/contact"
                                    className="relative z-10"
                                >
                                    Let&apos;s Chat
                                </Link>
                            </StarBorder>

                            <Link
                                href="/work"
                                className="inline-flex items-center px-8 py-4 text-sm font-medium text-brand-white/60 hover:text-brand-white uppercase tracking-widest transition-colors"
                            >
                                View Work →
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Right Column - Podcast Image with Play Button */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="order-1 lg:order-2 relative"
                    >
                        <div className="relative max-w-[390px] mx-auto lg:max-w-[425px]">
                            {/* Podcast Image */}
                            <motion.div
                                animate={{ y: [0, -25, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="relative"
                            >
                                <div className="relative rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(255,255,255,0.25)] ring-1 ring-brand-white/20">
                                    <Image
                                        src="/assets/images/podcastplayerv2.png"
                                        alt="The AI & Marketing Podcast - An Interview with Alex D'Amore"
                                        width={292}
                                        height={350}
                                        className="w-full h-auto"
                                        priority
                                    />

                                    {/* Frosted Glass Play Button - positioned over the image's play button */}
                                    <button
                                        onClick={toggleAudio}
                                        className="absolute left-1/2 -translate-x-1/2 bottom-[10%] w-11 h-11 flex items-center justify-center rounded-full bg-brand-white/20 backdrop-blur-xl border border-brand-white/30 hover:bg-brand-white/30 transition-all cursor-pointer shadow-lg"
                                        aria-label={isPlaying ? "Pause greeting" : "Play greeting"}
                                    >
                                        {/* Red pulsing ring */}
                                        <div className="absolute inset-[-6px] rounded-full border-2 border-brand-red animate-ping opacity-75" />
                                        <div className="absolute inset-[-3px] rounded-full border border-brand-red/50 animate-pulse" />
                                        {isPlaying ? (
                                            <Pause className="w-5 h-5 text-brand-white" />
                                        ) : (
                                            <Play className="w-5 h-5 text-brand-white ml-0.5" />
                                        )}
                                    </button>
                                </div>

                                {/* Audio error message */}
                                {audioError && !audioExists && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute -bottom-16 left-0 right-0 text-center"
                                    >
                                        <p className="text-xs text-brand-white/50 bg-brand-black/80 backdrop-blur-sm px-4 py-2 rounded-lg inline-block">
                                            📁 Add file: <code className="text-brand-blue">public/audio/greeting.mp3</code>
                                        </p>
                                    </motion.div>
                                )}
                            </motion.div>

                            {/* Hidden audio element */}
                            <audio
                                ref={audioRef}
                                src="/audio/greeting.mp3"
                                onEnded={handleAudioEnd}
                                preload="none"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-6 h-10 rounded-full border border-brand-white/20 flex items-start justify-center pt-2"
                >
                    <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-1 h-2 bg-brand-white/50 rounded-full"
                    />
                </motion.div>
            </motion.div>
        </section>
    );
}

export default HeroSection;
