"use client";

import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { Loader2, Trophy } from "lucide-react";

export default function WinnerPhase() {
    const { winner, players, resetGame, startGame, undercoverCount, mrWhiteCount } = useGame();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const playerNames = players.map((player) => player.name);

    const handleNextRound = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/generate-words", { method: "POST" });
            if (!res.ok) throw new Error("Failed to generate new words");
            const words = await res.json();
            startGame(playerNames, undercoverCount, mrWhiteCount, words);
        } catch (err) {
            console.error("Error starting next round:", err);
            setError(`Unable to start next round. ${err instanceof Error ? err.message : ""}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="space-y-8 text-center">
            <div className="rounded-3xl border border-yellow-300/40 bg-gradient-to-br from-amber-500/20 via-yellow-400/20 to-slate-900/70 p-8 shadow-[0_25px_80px_rgba(245,158,11,0.35)]">
                <div className="flex items-center justify-center gap-3 text-yellow-200">
                    <Trophy className="h-8 w-8" />
                    <p className="retro-label text-[10px] uppercase tracking-[0.6em]">game over</p>
                </div>
                <h2 className="mt-4 text-4xl font-bold capitalize text-white">
                    {winner === "citizen" ? "Citizens Victory" : "Impostors Triumph"}
                </h2>
                <p className="text-sm text-yellow-100/80">Roles revealed. Trust broken. Ready again?</p>

                <div className="mt-8 space-y-3 rounded-3xl border border-white/10 bg-white/10 px-6 py-4 text-left">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/60">final roster</p>
                    {players.map((player) => (
                        <div key={player.id} className="flex items-center justify-between text-sm font-semibold text-white">
                            <span>{player.name}</span>
                            <span
                                className={`rounded-full px-3 py-1 text-xs uppercase tracking-wide ${
                                    player.role === "citizen" ? "bg-cyan-500/20 text-cyan-100" : "bg-fuchsia-500/20 text-fuchsia-100"
                                }`}
                            >
                                {player.role}
                            </span>
                        </div>
                    ))}
                </div>
                {error && <p className="text-sm text-red-200">{error}</p>}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                <Button className="text-base" size="xl" onClick={handleNextRound} disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Preparing next round
                        </>
                    ) : (
                        "Run it back"
                    )}
                </Button>
                <Button
                    variant="ghost"
                    size="xl"
                    className="border border-white/25 text-base text-white/80 hover:text-white"
                    onClick={resetGame}
                    disabled={loading}
                >
                    End session
                </Button>
            </div>
            <p className="text-xs text-slate-400/80">Next round keeps player names. Hit End Session to rebuild the lobby.</p>
        </section>
    );
}
