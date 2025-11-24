"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useGame } from "@/context/GameContext";
import { Button } from "@/components/ui/button";

export default function RevealPhase() {
    const { players, setPhase } = useGame();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRevealed, setIsRevealed] = useState(false);
    const [wordImage, setWordImage] = useState<{ url: string; alt: string; credit: { name: string; link: string } } | null>(null);
    const [loadingImage, setLoadingImage] = useState(false);
    const currentPlayer = players[currentIndex];
    const progress = ((currentIndex + (isRevealed ? 1 : 0)) / players.length) * 100;

    const handleNext = () => {
        if (isRevealed) {
            setIsRevealed(false);
            setWordImage(null); // Reset image
            if (currentIndex < players.length - 1) {
                setCurrentIndex((prev) => prev + 1);
            } else {
                setPhase("clue");
            }
        } else {
            setIsRevealed(true);
            if (currentPlayer.role !== "mr_white") {
                fetchImage(currentPlayer.word);
            }
        }
    };

    const fetchImage = async (word: string) => {
        setLoadingImage(true);
        try {
            const res = await fetch(`/api/get-word-image?query=${encodeURIComponent(word)}`);
            if (res.ok) {
                const data = await res.json();
                setWordImage(data);
            }
        } catch (error) {
            console.error("Failed to fetch image", error);
        } finally {
            setLoadingImage(false);
        }
    };

    return (
        <section className="space-y-5 text-center sm:space-y-6">
            <div className="flex items-center justify-between text-[0.55rem] uppercase tracking-[0.35em] text-slate-300/60 sm:text-xs">
                <span>reveal order</span>
                <span>
                    {currentIndex + 1}/{players.length}
                </span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/10">
                <div
                    className="h-2 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 transition-all"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-900/40 p-6 shadow-2xl sm:p-8">
                <p className="retro-label text-[10px] text-cyan-200/80">PASS TO</p>
                <h2 className="text-3xl font-semibold">{currentPlayer.name}</h2>

                <div className="mt-6 min-h-[150px] rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-6 sm:mt-8 sm:px-6 sm:py-8">
                    {isRevealed ? (
                        <div className="space-y-4">
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">your word</p>
                            <p className="text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-fuchsia-300">
                                {currentPlayer.role === "mr_white" ? "???" : currentPlayer.word}
                            </p>

                            {wordImage && (
                                <div className="relative mx-auto mt-4 h-48 w-full overflow-hidden rounded-xl sm:h-64">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={wordImage.url}
                                        alt={wordImage.alt}
                                        className="h-full w-full object-cover transition-opacity duration-500"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1 text-[10px] text-white/70">
                                        Photo by <a href={wordImage.credit.link} target="_blank" rel="noopener noreferrer" className="underline">{wordImage.credit.name}</a> on Unsplash
                                    </div>
                                </div>
                            )}
                            {loadingImage && <div className="text-xs text-slate-500">Loading visual...</div>}

                            <p className="text-sm text-slate-300/80">
                                {currentPlayer.role === "mr_white" && "You are Mr. White. Improvise and stay calm."}
                                {currentPlayer.role === "undercover" && "Undercover agent. Blend in and redirect suspicion."}
                                {currentPlayer.role === "citizen" && "Citizen. Give sharp clues and sniff out impostors."}
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-4 text-slate-400">
                            <EyeOff className="h-16 w-16 opacity-40" />
                            <p className="text-sm">Tap to reveal your secret word</p>
                        </div>
                    )}
                </div>
            </div>

            <Button className="w-full text-sm sm:text-lg" size="xl" onClick={handleNext}>
                {isRevealed ? (currentIndex < players.length - 1 ? "Next player" : "Enter clue round") : "Reveal word"}
            </Button>
            <p className="text-[0.7rem] text-slate-400/70 sm:text-xs">Keep eyes averted until it&apos;s your turn.</p>
        </section>
    );
}
