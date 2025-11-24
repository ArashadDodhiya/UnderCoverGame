"use client";

import { useGame } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export default function CluePhase() {
    const { players, currentTurnIndex, nextTurn, setPhase } = useGame();
    const activePlayers = players.filter((player) => !player.isEliminated);
    const currentPlayer = players[currentTurnIndex];

    return (
        <section className="space-y-5 sm:space-y-6">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-900/50 p-5 sm:p-6">
                <p className="retro-label text-[0.65rem] text-cyan-200/80 sm:text-[10px]">live mic</p>
                <h2 className="text-2xl font-semibold sm:text-3xl">{currentPlayer.name}</h2>
                <p className="text-sm text-slate-300/80">
                    Drop a single word or short phrase. No repeating or spelling the word.
                </p>
            </div>

            <div className="rounded-3xl border border-white/5 bg-white/5 p-4 sm:p-5">
                <p className="mb-3 text-[0.7rem] uppercase tracking-[0.3em] text-slate-400/80 sm:text-xs">
                    active circle
                </p>
                <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
                    {activePlayers.map((player) => (
                        <div
                            key={player.id}
                            className={`flex items-center justify-between rounded-2xl border px-3 py-3 backdrop-blur transition sm:px-4 ${
                                player.id === currentPlayer.id
                                    ? "border-cyan-400/50 bg-cyan-400/10 text-white shadow-lg"
                                    : "border-white/10 bg-white/5 text-slate-200/80"
                            }`}
                        >
                            <span className="text-sm font-medium uppercase tracking-wide">{player.name}</span>
                            {player.id === currentPlayer.id && (
                                <span className="text-xs text-cyan-100/80">speaking</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                <Button className="text-sm sm:text-base" size="xl" onClick={nextTurn}>
                    Pass mic
                    <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                    variant="ghost"
                    size="xl"
                    onClick={() => setPhase("vote")}
                    className="border border-white/15 text-sm text-white/80 hover:text-white sm:text-base"
                >
                    Jump to voting
                </Button>
            </div>
            <p className="text-center text-[0.7rem] text-slate-400/70 sm:text-xs">
                Keep the energy high. If everyone has spoken, head straight to the interrogation.
            </p>
        </section>
    );
}
