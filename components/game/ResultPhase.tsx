"use client";

import { useMemo } from "react";
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

    if (!lastEliminatedPlayer) {
        return (
            <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center text-sm text-slate-300/80">
                Waiting for the vote to resolve...
            </div>
        );
    }

    return (
        <section className="space-y-8 text-center">
            <div className={`rounded-3xl border border-white/15 bg-gradient-to-br ${roleAccent} p-8 shadow-2xl`}>
                <p className="retro-label text-[10px] text-white/80">eliminated</p>
                <h2 className="text-4xl font-semibold">{lastEliminatedPlayer.name}</h2>
                <p className="mt-3 text-sm uppercase tracking-[0.3em] text-white/80">was</p>
                <p className="text-3xl font-bold text-white">
                    {lastEliminatedPlayer.role === "mr_white" ? "Mr. White" : lastEliminatedPlayer.role}
                </p>

                {lastEliminatedPlayer.role !== "citizen" && (
                    <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white/90">
                        Secret word:{" "}
                        <span className="font-semibold uppercase tracking-wide">{lastEliminatedPlayer.word || "unknown"}</span>
                    </div>
                )}
            </div>

            <Button className="w-full text-lg" size="xl" onClick={() => setPhase("clue")}>
                Continue round
            </Button>
            <p className="text-xs text-slate-400/80">If the lobby is ready, go back to clue mode until the next vote.</p>
        </section>
    );
}
