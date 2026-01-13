"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";

interface AudioContextType {
    isPlaying: boolean;
    togglePlay: () => void;
    play: () => void;
    pause: () => void;
    currentTime: number;
    duration: number;
    volume: number;
    setVolume: (val: number) => void;
    audioRef: React.RefObject<HTMLAudioElement | null>;
    showPlayer: boolean;
    setShowPlayer: (show: boolean) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [showPlayer, setShowPlayer] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);

    // We use a ref for the audio element so we can control it imperatively
    const audioRef = useRef<HTMLAudioElement>(null);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const play = () => {
        if (!audioRef.current) return;
        audioRef.current.play();
        setIsPlaying(true);
        setShowPlayer(true); // Auto-show the player when playback starts
    };

    const pause = () => {
        if (!audioRef.current) return;
        audioRef.current.pause();
        setIsPlaying(false);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    // Sync volume state with actual audio element
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    return (
        <AudioContext.Provider
            value={{
                isPlaying,
                togglePlay,
                play,
                pause,
                currentTime,
                duration,
                volume,
                setVolume,
                audioRef,
                showPlayer,
                setShowPlayer,
            }}
        >
            {/* The actual audio element lives here, permanently in the provider */}
            <audio
                ref={audioRef}
                src="/audio/alexinterviewsmaller.mp3"
                preload="none"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
            />
            {children}
        </AudioContext.Provider>
    );
}

export function useAudio() {
    const context = useContext(AudioContext);
    if (context === undefined) {
        throw new Error("useAudio must be used within an AudioProvider");
    }
    return context;
}
