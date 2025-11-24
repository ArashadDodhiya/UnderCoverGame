"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useGame } from "@/context/GameContext";
import { Button } from "@/components/ui/button";

export default function RevealPhase() {
    const { players, setPhase } = useGame();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRevealed, setIsRevealed] = useState(false);
    const currentPlayer = players[currentIndex];
    const progress = ((currentIndex + (isRevealed ? 1 : 0)) / players.length) * 100;

    const handleNext = () => {
        if (isRevealed) {
            setIsRevealed(false);
            if (currentIndex < players.length - 1) {
                setCurrentIndex((prev) => prev + 1);
            } else {
                setPhase("clue");
            }
        } else {
            setIsRevealed(true);
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
