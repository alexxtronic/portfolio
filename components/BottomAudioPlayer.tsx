"use client";

import { useAudio } from "@/context/AudioContext";
import { Play, Pause, Volume2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function BottomAudioPlayer() {
    const {
        isPlaying,
        togglePlay,
        currentTime,
        duration,
        volume,
        setVolume,
        showPlayer,
        setShowPlayer,
    } = useAudio();

    // If not supposed to show, return null (but AnimatePresence handles the exit anim)
    return (
        <AnimatePresence>
            {showPlayer && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md"
                >
                    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl ring-1 ring-white/5 flex flex-col gap-3">
                        {/* Top Row: Play/Pause - Info - Close */}
                        <div className="flex items-center justify-between gap-4">
                            <button
                                onClick={togglePlay}
                                className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 transition-colors shrink-0"
                            >
                                {isPlaying ? (
                                    <Pause className="w-4 h-4 fill-current" />
                                ) : (
                                    <Play className="w-4 h-4 fill-current ml-0.5" />
                                )}
                            </button>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    Alex D'Amore
                                </p>
                                <p className="text-xs text-white/50 truncate">
                                    Podcast Interview
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="text-xs text-white/50 font-mono hidden sm:block">
                                    {formatTime(currentTime)} / {formatTime(duration || 0)}
                                </div>
                                <button
                                    onClick={() => setShowPlayer(false)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-brand-blue rounded-full relative" // Using brand-blue for progress
                                style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                            >
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                            </div>
                        </div>

                        {/* Mobile Time (only visible on small screens) */}
                        <div className="flex justify-between sm:hidden text-[10px] text-white/40 font-mono px-1">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration || 0)}</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
