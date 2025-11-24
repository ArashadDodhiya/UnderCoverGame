"use client";

import { useMemo, useEffect } from "react";
import { useGame } from "@/context/GameContext";
import { Button } from "@/components/ui/button";

export default function ResultPhase() {
    const { lastEliminatedPlayer, setPhase } = useGame();

    const roleAccent = useMemo(() => {
        if (!lastEliminatedPlayer) return "from-slate-900/90 to-slate-800/60";
        switch (lastEliminatedPlayer.role) {
            case "undercover":
                return "from-fuchsia-700/60 via-fuchsia-500/30 to-slate-900/60";
            case "mr_white":
                return "from-amber-500/40 via-amber-300/20 to-slate-900/60";
            default:
                return "from-cyan-600/40 via-cyan-400/20 to-slate-900/60";
        }
    }, [lastEliminatedPlayer]);

    // Play sound if impostor is eliminated
    // Play sound if impostor is eliminated
    useEffect(() => {
        if (lastEliminatedPlayer && (lastEliminatedPlayer.role === 'undercover' || lastEliminatedPlayer.role === 'mr_white')) {
            console.log("sound generate");
            const audio = new Audio('/sounds/undercover-detected.mp3');
            audio.play().catch(e => console.error("Error playing sound:", e));
        }
    }, [lastEliminatedPlayer]);

    if (!lastEliminatedPlayer) {
        return (
            <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-slate-300/80 sm:px-6 sm:py-12">
                Waiting for the vote to resolve...
            </div>
        );
    }

    return (
        <section className="space-y-6 text-center sm:space-y-8">
            <div className={`rounded-3xl border border-white/15 bg-gradient-to-br ${roleAccent} p-6 shadow-2xl sm:p-8`}>
                <p className="retro-label text-[0.65rem] text-white/80 sm:text-[10px]">eliminated</p>
                <h2 className="text-3xl font-semibold sm:text-4xl">{lastEliminatedPlayer.name}</h2>
                <p className="mt-3 text-xs uppercase tracking-[0.3em] text-white/80 sm:text-sm">was</p>
                <p className="text-2xl font-bold text-white sm:text-3xl">
                    {lastEliminatedPlayer.role === "mr_white" ? "Mr. White" : lastEliminatedPlayer.role}
                </p>

                {lastEliminatedPlayer.role !== "citizen" && (
                    <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white/90">
                        Secret word:{" "}
                        <span className="font-semibold uppercase tracking-wide">{lastEliminatedPlayer.word || "unknown"}</span>
                    </div>
                )}
            </div>

            <Button className="w-full text-sm sm:text-lg" size="xl" onClick={() => setPhase("clue")}>
                Continue round
            </Button>
            <p className="text-[0.7rem] text-slate-400/80 sm:text-xs">If the lobby is ready, go back to clue mode until the next vote.</p>
        </section>
    );
}
