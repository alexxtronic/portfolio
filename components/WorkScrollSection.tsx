"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import ScrollFloat from "./ScrollFloat";

const workItems = [
    {
        id: 1,
        title: "Empire State Building",
        subtitle: "Renegade Marketing Agency",
        description:
            "Took the Empire State Building from 0 to 1.2M followers on TikTok in just one year. Lead social media analyst and paid ads manager, crafting marketing data frameworks and visual dashboards that informed C-level decisions.",
        video: "/assets/videos/01-empire.mov",
    },
    {
        id: 2,
        title: "Novo Nordisk",
        subtitle: "C-Suite HubSpot Optimization",
        description:
            "Delivered AI agentic automations including MCP connected dashboard and custom-built SaaS platforms for internal knowledge sharing.",
        video: "/_assets/novoloop2small.mov",
    },
    {
        id: 3,
        title: "Specsavers",
        subtitle: "Marketing Automation",
        description:
            "Designed and built n8n-based automation frameworks connecting ad platforms, CRM & data warehouses. Created internal lead scoring engines integrated with HubSpot via MCP, saving the sales team 10+ hours weekly.",
        video: "/_assets/specsloop2_small.mov",
    },
    {
        id: 4,
        title: "LEMAN",
        subtitle: "HubSpot Funnel Optimization",
        description:
            "Optimized LEMAN's HubSpot funnel driving 3x SQL growth in a single quarter. Implemented advanced lead nurturing sequences, attribution modeling, and automated handoff workflows that transformed their sales pipeline efficiency.",
        video: "/_assets/truckloop_2_small.mov",
    },
];

export function WorkScrollSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Subscribe to scroll progress and update active index
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const newIndex = Math.min(
            workItems.length - 1,
            Math.floor(latest * workItems.length)
        );
        if (newIndex !== activeIndex) {
            setActiveIndex(newIndex);
        }
    });

    const handleDotClick = (index: number) => {
        if (!containerRef.current) return;
        const containerTop = containerRef.current.offsetTop;
        const containerHeight = containerRef.current.offsetHeight - window.innerHeight;
        const scrollTarget = containerTop + (index / workItems.length) * containerHeight;
        window.scrollTo({ top: scrollTarget, behavior: "smooth" });
    };

    return (
        <section
            ref={containerRef}
            className="relative"
            style={{ height: `${workItems.length * 50}vh` }}
        >
            {/* Sticky Container - This is what "freezes" on screen */}
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
                {/* Section Header - Moved down to avoid nav obstruction */}
                <div className="absolute top-[6rem] md:top-[7rem] left-0 right-0 text-center z-20">
                    {mounted && (
                        <ScrollFloat stagger={0.04}>
                            Some of my work
                        </ScrollFloat>
                    )}
                </div>

                {/* Cards Container */}
                <div className="relative w-full max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-8 md:gap-16 mt-20 md:mt-0">
                    <AnimatePresence mode="wait">
                        <WorkCard key={workItems[activeIndex].id} item={workItems[activeIndex]} index={activeIndex} />
                    </AnimatePresence>
                </div>

                {/* Progress Dots */}
                <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20">
                    {workItems.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handleDotClick(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${index === activeIndex
                                ? "bg-brand-white scale-150"
                                : "bg-brand-white/30 hover:bg-brand-white/50"
                                }`}
                            aria-label={`Go to project ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function WorkCard({ item, index }: { item: (typeof workItems)[0]; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col md:flex-row items-center gap-10 md:gap-16 w-full"
        >
            {/* Video Side - Pure Black Background */}
            <div className="w-full md:w-[55%]">
                <div
                    className={`relative aspect-square rounded-[24px] overflow-hidden shadow-2xl ${item.title === "LEMAN" ? "bg-[#060606]" : "bg-black"
                        }`}
                >
                    {item.video ? (
                        <video
                            src={item.video}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-brand-white/30">Video Placeholder</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Text Side - Larger Card */}
            <div className="w-full md:w-[45%]">
                <div className={`p-10 md:p-12 rounded-[28px] backdrop-blur-xl border border-brand-white/10 ${item.title === "LEMAN" ? "bg-[#060606]" : "bg-brand-white/5"
                    }`}>
                    <span className="text-brand-blue text-sm uppercase tracking-widest font-medium mb-4 block">
                        {item.subtitle}
                    </span>
                    <h3 className="font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl lg:text-6xl text-brand-white mb-8">
                        {item.title}
                    </h3>
                    <p className="text-brand-white/60 text-lg md:text-xl leading-relaxed">
                        {item.description}
                    </p>
                    <div className="mt-10 flex items-center gap-4">
                        <span className="text-xs font-mono text-brand-white/30">
                            0{index + 1}
                        </span>
                        <div className="h-[1px] w-12 bg-brand-white/10" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default WorkScrollSection;
