"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ExternalLink } from "lucide-react";
import GlassSurface from "@/components/GlassSurface";

const caseStudies = [
    {
        id: "empire-state",
        title: "Empire State Building",
        category: "Social Content",
        image: "/assets/images/work/empire.jpg",
        video: "/assets/videos/01-empire.mov",
        context:
            "The Empire State Building wanted to showcase its iconic status through immersive social media content that would resonate with a global audience.",
        challenge:
            "Create shareable, high-impact video content that captures the building's majesty while fitting platform-specific formats and attention spans.",
        approach:
            "Developed a series of dynamic video sequences using cutting-edge techniques, emphasizing dramatic lighting and vertical formats optimized for mobile consumption.",
        results: [
            "2M+ organic views across platforms",
            "45% increase in social engagement",
            "Content featured in travel publications",
        ],
        tech: ["Premiere Pro", "After Effects", "Social Strategy"],
    },
    {
        id: "novo-nordisk",
        title: "Novo Nordisk",
        category: "Healthcare Marketing",
        image: "/assets/images/work/novo.jpg",
        video: "/assets/videos/02-novo.mp4",
        context:
            "Global pharmaceutical leader needed to optimize digital patient acquisition while maintaining strict regulatory compliance across multiple markets.",
        challenge:
            "Navigate complex healthcare regulations while building efficient conversion funnels and nurture sequences that respect patient privacy.",
        approach:
            "Implemented precision-targeted campaigns with custom audience segmentation, automated compliance workflows, and multi-touch attribution modeling.",
        results: [
            "35% reduction in cost-per-acquisition",
            "Scaled campaigns across 12 markets",
            "Built compliant automation frameworks",
        ],
        tech: ["HubSpot", "Meta Ads", "Google Analytics", "n8n"],
    },
    {
        id: "specsavers",
        title: "Specsavers",
        category: "Retail Performance",
        image: "/assets/images/work/specsavers.jpg",
        video: "/assets/videos/03-specsavers.mp4",
        context:
            "Major optical retailer sought to bridge online discovery with in-store appointments, creating a seamless omnichannel experience.",
        challenge:
            "Drive measurable foot traffic from digital campaigns while tracking the full customer journey from ad click to store visit.",
        approach:
            "Built AI-powered audience segmentation, implemented store visit tracking, and created dynamic creative optimization based on location and inventory.",
        results: [
            "28% increase in booked appointments",
            "3.2x ROAS on store visit campaigns",
            "Real-time inventory-based targeting",
        ],
        tech: ["Meta Ads", "LinkedIn Ads", "HubSpot", "Custom Attribution"],
    },
    {
        id: "leman",
        title: "LEMAN",
        category: "B2B Maritime",
        image: "/assets/images/work/leman.jpg",
        video: "/assets/videos/04-leman.mp4",
        context:
            "Leading shipping and logistics company needed to modernize their B2B marketing stack and generate qualified leads at scale.",
        challenge:
            "Long sales cycles, multiple stakeholders, and a historically offline industry meant traditional digital tactics wouldn't work.",
        approach:
            "Developed account-based marketing programs integrated with CRM, automated lead scoring, and personalized nurture tracks based on company size and cargo type.",
        results: [
            "150+ qualified leads per quarter",
            "45% shorter sales cycle",
            "Full HubSpot implementation",
        ],
        tech: ["HubSpot Enterprise", "LinkedIn Ads", "n8n", "Make.com"],
    },
];

export function WorkPageClient() {
    const [selectedStudy, setSelectedStudy] = useState<
        (typeof caseStudies)[0] | null
    >(null);

    return (
        <main className="min-h-screen pt-32 pb-24">
            {/* Hero */}
            <section className="container mx-auto px-6 mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl"
                >
                    <span className="font-[family-name:var(--font-cormorant)] text-xs uppercase tracking-[0.3em] text-brand-blue mb-4 block">
                        Case Studies
                    </span>
                    <h1 className="font-[family-name:var(--font-cormorant)] text-5xl md:text-6xl lg:text-7xl mb-6">
                        The <span className="italic text-brand-white/60">work</span>
                    </h1>
                    <p className="text-lg text-brand-white/60 max-w-xl">
                        A selection of projects where I&apos;ve helped brands build systems
                        that scale, from Fortune 500 enterprises to ambitious startups.
                    </p>
                </motion.div>
            </section>

            {/* Case Study Grid */}
            <section className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {caseStudies.map((study, index) => (
                        <motion.div
                            key={study.id}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <CaseStudyCard
                                study={study}
                                onClick={() => setSelectedStudy(study)}
                            />
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Modal */}
            <AnimatePresence>
                {selectedStudy && (
                    <CaseStudyModal
                        study={selectedStudy}
                        onClose={() => setSelectedStudy(null)}
                    />
                )}
            </AnimatePresence>
        </main>
    );
}

function CaseStudyCard({
    study,
    onClick,
}: {
    study: (typeof caseStudies)[0];
    onClick: () => void;
}) {
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
            className="group text-left w-full"
        >
            <GlassSurface
                borderRadius={24}
                borderWidth={0.08}
                brightness={55}
                opacity={0.7}
                blur={16}
                backgroundOpacity={0.1}
                distortionScale={-200}
                width="100%"
                height="auto"
                className="w-full"
            >
                <div className={`relative overflow-hidden rounded-3xl border border-brand-white/10 ${study.title === "LEMAN" ? "bg-[#060606]" : "bg-brand-white/5"
                    }`}>
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-gradient-to-br from-brand-blue/20 to-brand-red/20 overflow-hidden">
                        {/* Placeholder gradient - replace with actual images */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-6xl font-[family-name:var(--font-cormorant)] italic text-brand-white/20">
                                {study.title.charAt(0)}
                            </span>
                        </div>

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-brand-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-sm uppercase tracking-widest text-brand-white flex items-center gap-2">
                                View Case Study <ExternalLink className="w-4 h-4" />
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <span className="font-[family-name:var(--font-cormorant)] text-xs uppercase tracking-widest text-brand-blue mb-2 block">
                            {study.category}
                        </span>
                        <h3 className="font-[family-name:var(--font-cormorant)] text-2xl md:text-3xl mb-3 group-hover:text-brand-blue transition-colors">
                            {study.title}
                        </h3>
                        <p className="text-brand-white/60 text-sm line-clamp-2">
                            {study.context}
                        </p>

                        {/* Tech tags */}
                        <div className="flex flex-wrap gap-2 mt-4">
                            {study.tech.slice(0, 3).map((t) => (
                                <span
                                    key={t}
                                    className="px-2 py-1 text-xs text-brand-white/50 bg-brand-white/5 rounded"
                                >
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </GlassSurface>
        </motion.button>
    );
}

function CaseStudyModal({
    study,
    onClose,
}: {
    study: (typeof caseStudies)[0];
    onClose: () => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-brand-black border border-brand-white/10"
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-brand-white/10 hover:bg-brand-white/20 transition-colors"
                    aria-label="Close modal"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Video/Image Header */}
                <div className="relative aspect-video bg-gradient-to-br from-brand-blue/20 to-brand-red/20">
                    {study.video.includes("01-empire") ? (
                        <video
                            src={study.video}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-8xl font-[family-name:var(--font-cormorant)] italic text-brand-white/20">
                                {study.title.charAt(0)}
                            </span>
                            <p className="absolute bottom-4 text-xs text-brand-white/30">
                                Add: {study.video.split("/").pop()}
                            </p>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-8 md:p-12">
                    <span className="font-[family-name:var(--font-cormorant)] text-xs uppercase tracking-widest text-brand-blue mb-3 block">
                        {study.category}
                    </span>
                    <h2 className="font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl mb-8">
                        {study.title}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                            <h3 className="text-xs uppercase tracking-widest text-brand-white/30 mb-3">
                                Context
                            </h3>
                            <p className="text-brand-white/70">{study.context}</p>
                        </div>
                        <div>
                            <h3 className="text-xs uppercase tracking-widest text-brand-white/30 mb-3">
                                Challenge
                            </h3>
                            <p className="text-brand-white/70">{study.challenge}</p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-xs uppercase tracking-widest text-brand-white/30 mb-3">
                            Approach
                        </h3>
                        <p className="text-brand-white/70">{study.approach}</p>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-xs uppercase tracking-widest text-brand-white/30 mb-3">
                            Results
                        </h3>
                        <ul className="space-y-2">
                            {study.results.map((result, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-blue mt-2" />
                                    <span className="text-brand-white">{result}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Tech Stack */}
                    <div>
                        <h3 className="text-xs uppercase tracking-widest text-brand-white/30 mb-3">
                            Tech Stack
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {study.tech.map((t) => (
                                <span
                                    key={t}
                                    className="px-3 py-1.5 text-sm text-brand-blue bg-brand-blue/10 border border-brand-blue/20 rounded-full"
                                >
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
