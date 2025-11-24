"use client";

import { useGame } from "@/context/GameContext";
import { ShieldCheck, Skull } from "lucide-react";

export default function VotePhase() {
    const { players, eliminatePlayer } = useGame();
    const activePlayers = players.filter((player) => !player.isEliminated);

    return (
        <section className="space-y-5 sm:space-y-6">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-900/50 p-5 text-center sm:p-6">
                <p className="retro-label text-[0.65rem] text-fuchsia-200/80 sm:text-[10px]">interrogation</p>
                <h2 className="text-2xl font-semibold sm:text-3xl">Who sounded sus?</h2>
                <p className="text-sm text-slate-300/80">
                    Discuss loudly. When the room agrees, hit their card to eliminate.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {activePlayers.map((player) => (
                    <button
                        type="button"
                        key={player.id}
                        onClick={() => eliminatePlayer(player.id)}
                        className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 px-5 py-5 text-left transition hover:border-fuchsia-400/40 hover:bg-fuchsia-500/10 sm:px-6"
                    >
                        <div className="absolute inset-0 scale-0 rounded-3xl bg-gradient-to-r from-cyan-400/20 to-fuchsia-400/20 opacity-0 transition group-hover:scale-105 group-hover:opacity-100" />
                        <div className="relative flex items-center justify-between">
                            <div>
                                <p className="text-[0.7rem] uppercase tracking-[0.3em] text-slate-400/70 sm:text-xs">tap to accuse</p>
                                <p className="text-xl font-semibold text-white sm:text-2xl">{player.name}</p>
                            </div>
                            <Skull className="h-8 w-8 text-white/40 group-hover:text-fuchsia-200" />
                        </div>
                    </button>
                ))}
                {activePlayers.length === 0 && (
                    <div className="rounded-3xl border border-cyan-300/30 bg-cyan-400/10 px-5 py-8 text-center text-sm text-cyan-100 sm:px-6">
                        No one to vote on. Restart the game to play another round.
                    </div>
                )}
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-center text-[0.7rem] text-slate-300/80 sm:text-xs">
                Break ties with another clue round or flip a coin if your lobby can&apos;t agree.
            </div>
            <div className="flex items-center justify-center gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-slate-400/60 sm:text-xs">
                <ShieldCheck className="h-4 w-4" />
                Voting locks instantly—no takebacks.
            </div>
        </section>
    );
}
