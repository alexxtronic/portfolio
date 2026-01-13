"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import ScrollFloat from "./ScrollFloat";

const skills = [
    { name: "Antigravity CLI", level: 95, category: "AI Tools" },
    { name: "Cursor", level: 90, category: "AI Tools" },
    { name: "LinkedIn Ads", level: 85, category: "Advertising" },
    { name: "Agentic Automation", level: 80, category: "AI Tools" },
    { name: "Meta Ads", level: 80, category: "Advertising" },
    { name: "Codex", level: 80, category: "AI Tools" },
    { name: "HubSpot", level: 75, category: "CRM" },
    { name: "n8n", level: 70, category: "Automation" },
    { name: "Make.com", level: 60, category: "Automation" },
];

export function CompetenciesSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: "-100px" });

    // Group skills by category
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
                    <span className="text-xs uppercase tracking-[0.3em] text-brand-blue mb-4 block">
                        Competencies
                    </span>


                    <div className="flex justify-center">
                        <ScrollFloat stagger={0.05}>
                            The toolkit
                        </ScrollFloat>
                    </div>
                </motion.div>

                {/* Skills Grid */}
                <div className="max-w-4xl mx-auto">
                    {/* All skills in order */}
                    <div className="space-y-6">
                        {skills.map((skill, index) => (
                            <motion.div
                                key={skill.name}
                                initial={{ opacity: 0, x: -30 }}
                                animate={isInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                            >
                                <SkillBar
                                    skill={skill}
                                    index={index}
                                    isInView={isInView}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Category Legend */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap justify-center gap-6 mt-12"
                >
                    {categories.map((category) => (
                        <div key={category} className="flex items-center gap-2">
                            className={`w-3 h-3 rounded-full ${category === "AI Tools"
                                ? "bg-yellow-300"
                                : category === "Advertising"
                                    ? "bg-yellow-400"
                                    : category === "CRM"
                                        ? "bg-yellow-600"
                                        : "bg-yellow-500"
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

function SkillBar({
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
                return "bg-gradient-to-r from-yellow-300 to-yellow-300/60";
            case "Advertising":
                return "bg-gradient-to-r from-yellow-400 to-yellow-400/60";
            case "CRM":
                return "bg-gradient-to-r from-yellow-600 to-yellow-600/60";
            case "Automation":
                return "bg-gradient-to-r from-yellow-500 to-yellow-500/60";
            default:
                return "bg-gradient-to-r from-brand-white to-brand-white/60";
        }
    };

    return (
        <div className="group">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-brand-white group-hover:text-brand-blue transition-colors">
                    {skill.name}
                </span>
                <span className="text-xs text-brand-white/50 tabular-nums">
                    {skill.level}%
                </span>
            </div>

            {/* Progress Bar Container */}
            <div
                className="relative h-2 bg-brand-white/10 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={skill.level}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${skill.name}: ${skill.level}%`}
            >
                {/* Animated Fill */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                    transition={{
                        duration: 1,
                        delay: index * 0.08,
                        ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className={`absolute inset-y-0 left-0 rounded-full ${getBarColor(
                        skill.category
                    )}`}
                >
                    {/* Shine effect */}
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={isInView ? { x: "200%" } : { x: "-100%" }}
                        transition={{
                            duration: 1.5,
                            delay: index * 0.08 + 0.5,
                            ease: "easeInOut",
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    />
                </motion.div>
            </div>
        </div>
    );
}

export default CompetenciesSection;
