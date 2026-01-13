"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import ScrollFloat from "./ScrollFloat";

const skills = [
    { name: "Antigravity CLI", level: 95, category: "AI Tools" },
    { name: "Cursor", level: 90, category: "AI Tools" },
    { name: "LinkedIn Ads", level: 85, category: "Advertising" },
    { name: "Claude Code", level: 80, category: "AI Tools" },
    { name: "Clay CRM", level: 80, category: "CRM" },
    { name: "Meta Ads", level: 80, category: "Advertising" },
    { name: "Codex", level: 80, category: "AI Tools" },
    { name: "HubSpot", level: 75, category: "CRM" },
    { name: "Ahrefs", level: 75, category: "Advertising" },
    { name: "n8n", level: 70, category: "Automation" },
    { name: "Make.com", level: 60, category: "Automation" },
];

export function CompetenciesSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: "-100px" });

    // Group skills by category for legend
    const categories = [...new Set(skills.map((s) => s.category))];

    return (
        <section
            ref={containerRef}
            className="relative py-24 md:py-32 overflow-hidden"
        >
            {/* Background */}
            <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-brand-blue/10 rounded-full blur-[150px] pointer-events-none" />
                <div className="absolute top-1/4 right-1/3 w-[300px] h-[300px] bg-brand-red/10 rounded-full blur-[120px] pointer-events-none" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="font-[family-name:var(--font-cormorant)] text-xs uppercase tracking-[0.3em] text-brand-blue mb-4 block">
                        Competencies
                    </span>
                    <div className="flex justify-center">
                        <ScrollFloat stagger={0.05}>
                            The toolkit
                        </ScrollFloat>
                    </div>
                </motion.div>

                {/* Vertical Chart Container */}
                <div className="max-w-5xl mx-auto h-[500px] flex items-end justify-between gap-2 md:gap-4 pb-12 border-b border-brand-white/10 relative">
                    {skills.map((skill, index) => (
                        <SkillColumn
                            key={skill.name}
                            skill={skill}
                            index={index}
                            isInView={isInView}
                        />
                    ))}
                </div>

                {/* Category Legend */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap justify-center gap-6 mt-20"
                >
                    {categories.map((category) => (
                        <div key={category} className="flex items-center gap-2">
                            <div
                                className={`w-3 h-3 rounded-full ${category === "AI Tools"
                                    ? "bg-yellow-200"
                                    : category === "Advertising"
                                        ? "bg-yellow-400"
                                        : category === "CRM"
                                            ? "bg-orange-600"
                                            : "bg-amber-500"
                                    }`}
                            />
                            <span className="text-xs uppercase tracking-wider text-brand-white/50">
                                {category}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

function SkillColumn({
    skill,
    index,
    isInView,
}: {
    skill: (typeof skills)[0];
    index: number;
    isInView: boolean;
}) {
    const getBarColor = (category: string) => {
        switch (category) {
            case "AI Tools":
                return "bg-gradient-to-t from-yellow-200 to-yellow-200/60";
            case "Advertising":
                return "bg-gradient-to-t from-yellow-400 to-yellow-400/60";
            case "CRM":
                return "bg-gradient-to-t from-orange-600 to-orange-600/60";
            case "Automation":
                return "bg-gradient-to-t from-amber-500 to-amber-500/60";
            default:
                return "bg-gradient-to-t from-brand-white to-brand-white/60";
        }
    };

    return (
        <div className="relative flex flex-col items-center justify-end h-full w-full group">
            {/* Percentage Label - Floating above */}
            <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                className="mb-2 text-xs md:text-sm font-medium text-brand-white/70"
            >
                {skill.level}%
            </motion.span>

            {/* The Bar */}
            <div className="w-full h-full max-h-[80%] flex items-end">
                <motion.div
                    initial={{ height: 0 }}
                    animate={isInView ? { height: `${skill.level}%` } : {}}
                    transition={{
                        duration: 1.5,
                        delay: index * 0.15,
                        ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className={`w-full rounded-t-sm md:rounded-t-lg relative overflow-hidden ${getBarColor(skill.category)}`}
                >
                    {/* Shine effect vertical */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={isInView ? { y: "-100%" } : { y: "100%" }}
                        transition={{
                            duration: 1.5,
                            delay: index * 0.15 + 0.5,
                            ease: "easeInOut",
                        }}
                        className="absolute inset-0 bg-gradient-to-t from-transparent via-white/30 to-transparent"
                    />
                </motion.div>
            </div>

            {/* Name Label - Below X axis */}
            <div className="absolute -bottom-28 md:-bottom-16 w-full flex justify-center items-start h-28 md:h-16">
                <span className="text-[8px] md:text-xs font-medium text-brand-white/60 uppercase tracking-wide text-center leading-tight -rotate-45 md:rotate-0 origin-top-left md:origin-center translate-y-8 md:translate-y-0 w-20 md:w-auto">
                    {skill.name}
                </span>
            </div>
        </div>
    );
}

export default CompetenciesSection;
