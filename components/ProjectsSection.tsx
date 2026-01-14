"use client";

import { motion } from "framer-motion";
import SpotlightCard from "./SpotlightCard";
import ScrollFloat from "./ScrollFloat";


const projects = [
    {
        name: "HubSpot Enterprise Migration",
        value: "Unified customer data into a single source of truth.",
        outcomes: [
            "Migrated 50,000+ contacts with zero data loss",
            "Reduced manual entry by 80% via custom integrations",
        ],
        tools: ["HubSpot", "n8n", "APIs", "Data Migration"],
    },
    {
        name: "AI Agent Orchestration",
        value: "Built autonomous workflows that operate 24/7.",
        outcomes: [
            "Deployed multi-agent systems for lead qualification",
            "Reduced response time from hours to minutes",
        ],
        tools: ["Antigravity", "Cursor", "n8n", "LLMs"],
    },
    {
        name: "Performance Marketing Stack",
        value: "Data-driven campaigns with real-time optimization.",
        outcomes: [
            "Achieved 3x ROAS improvement across channels",
            "Built custom attribution models for full-funnel visibility",
        ],
        tools: ["Meta Ads", "LinkedIn Ads", "Google Analytics", "HubSpot"],
    },
    {
        name: "Automated Outreach Pipeline",
        value: "Personalized sequences at scale without the spam.",
        outcomes: [
            "Generated 150+ qualified leads per month",
            "40% open rate on cold email campaigns",
        ],
        tools: ["Make.com", "HubSpot", "Clay", "LinkedIn"],
    },
];

export function ProjectsSection() {
    return (
        <section className="relative py-24 md:py-32 overflow-hidden">
            {/* Background */}
            {/* Background: Transparent to show global LightPillar */}

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="font-[family-name:var(--font-cormorant)] text-base uppercase tracking-[0.3em] text-brand-blue mb-4 block">
                        Projects
                    </span>
                    <div className="flex justify-center">
                        <ScrollFloat stagger={0.05}>
                            Systems that scale
                        </ScrollFloat>
                    </div>
                </motion.div>

                {/* Project Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.name}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <ProjectCard project={project} index={index} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function ProjectCard({
    project,
    index,
}: {
    project: (typeof projects)[0];
    index: number;
}) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            className="h-full"
        >
            <SpotlightCard
                className="h-full border-brand-white/10 bg-brand-white/5 hover:bg-brand-black transition-colors"
                spotlightColor="rgba(0, 229, 255, 0.15)"
            >
                <div className="h-full flex flex-col">
                    {/* Project Name */}
                    <h3 className="font-[family-name:var(--font-cormorant)] text-2xl md:text-3xl mb-3 text-brand-white">
                        {project.name}
                    </h3>

                    {/* Value Statement */}
                    <p className="text-brand-white/70 text-base mb-6">{project.value}</p>

                    {/* Outcomes */}
                    <div className="space-y-3 mb-8">
                        {project.outcomes.map((outcome, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-blue mt-2 shrink-0" />
                                <p className="text-sm text-brand-white/60">{outcome}</p>
                            </div>
                        ))}
                    </div>

                    {/* Tools Tags */}
                    <div className="flex flex-wrap gap-2 mt-auto">
                        {project.tools.map((tool) => (
                            <span
                                key={tool}
                                className="px-3 py-1 text-xs uppercase tracking-wider text-brand-blue/80 bg-brand-blue/10 border border-brand-blue/20 rounded-full"
                            >
                                {tool}
                            </span>
                        ))}
                    </div>
                </div>
            </SpotlightCard>
        </motion.div>
    );
}

export default ProjectsSection;
