"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import Image from "next/image";
import GlassSurface from "./GlassSurface";
import ScrollFloat from "./ScrollFloat";

const reviews = [
    {
        name: "Jentry Theis",
        role: "Marketing Director @ Humana",
        image: "/assets/images/reviews/jentry.jpg",
        text: "Alex always kept an eye out for new features to test and learn with an agile approach. His can-do and get-it-done attitude was certainly an asset to our team, and I enjoyed working with him!",
        stars: 5,
    },
    {
        name: "Henrik Stenmann",
        role: "CEO @ Dear Future",
        image: "/assets/images/reviews/henrik.jpg",
        text: "Alex excels at quickly adopting and applying new AI tools in practice. He works at a fast pace and is able to juggle multiple technologies simultaneously, enabling him to create tangible value in a short time. I can recommend Alex to companies looking for someone with strong competencies in AI and technology!",
        stars: 5,
    },
    {
        name: "John Synnes",
        role: "Lead Data & AI Strategy @ Dear Future",
        image: "/assets/images/reviews/john.jpg",
        text: "Alex approaches challenges in ways that make me think differently, and I'm constantly learning from how he navigates complexity. Add in his professionalism and that get **** done energy, and he's setting a bar I genuinely look up to!",
        stars: 5,
    },
];

export function ReviewsSection() {
    return (
        <section className="relative min-h-screen py-24 md:py-32 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-blue/5 to-transparent pointer-events-none" />

            {/* Ambient Glows */}
            <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-brand-blue/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-brand-red/10 blur-[100px] rounded-full pointer-events-none" />

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
                        Testimonials
                    </span>
                    <div className="flex justify-center">
                        <ScrollFloat stagger={0.05}>
                            Kind words
                        </ScrollFloat>
                    </div>
                </motion.div>

                {/* Reviews Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {reviews.map((review, index) => (
                        <motion.div
                            key={review.name}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                        >
                            <ReviewCard review={review} index={index} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function ReviewCard({
    review,
    index,
}: {
    review: (typeof reviews)[0];
    index: number;
}) {
    return (
        <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{
                duration: 5 + index,
                repeat: Infinity,
                ease: "easeInOut",
            }}
            className="group relative h-full"
        >
            {/* Glass Shadow/Refraction Layer */}
            <div className="absolute -inset-3 transform translate-y-4 translate-x-4 transition-transform duration-300 group-hover:translate-x-5 group-hover:translate-y-5">
                <GlassSurface
                    borderRadius={20}
                    borderWidth={0.1}
                    brightness={40}
                    opacity={0.5}
                    blur={24}
                    displace={3}
                    backgroundOpacity={0.4}
                    saturation={0}
                    distortionScale={-250}
                    width="100%"
                    height="100%"
                    className="w-full h-full"
                >
                    <div className="w-full h-full" />
                </GlassSurface>
            </div>

            {/* Main Card - White with Black Text */}
            <motion.div
                whileHover={{ y: -5, x: -5 }}
                transition={{ duration: 0.3 }}
                className="relative h-full bg-brand-white/95 backdrop-blur-xl rounded-2xl p-8 md:p-10 border border-brand-white/20 shadow-xl flex flex-col justify-between"
            >
                {/* Quote Icon and Stars */}
                <div>
                    <div className="flex justify-between items-start mb-6">
                        <Quote className="w-10 h-10 text-brand-black/10 fill-current" />
                        <div className="flex space-x-1">
                            {[...Array(review.stars)].map((_, i) => (
                                <Star
                                    key={i}
                                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Quote Text */}
                    <p className="text-brand-black font-[family-name:var(--font-cormorant)] text-lg md:text-xl leading-relaxed italic">
                        &ldquo;{review.text}&rdquo;
                    </p>
                </div>

                {/* Author */}
                <div className="flex items-center gap-4 mt-8 pt-6 border-t border-brand-black/10">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-brand-black/10">
                        <Image
                            src={review.image}
                            alt={review.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <h4 className="text-brand-black font-bold text-base leading-tight">
                            {review.name}
                        </h4>
                        <p className="text-brand-black/60 text-xs mt-1 font-medium tracking-wide">
                            {review.role}
                        </p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default ReviewsSection;
