"use client";

import { GameProvider, useGame } from "@/context/GameContext";
import SetupPhase from "@/components/game/SetupPhase";
import RevealPhase from "@/components/game/RevealPhase";
import CluePhase from "@/components/game/CluePhase";
import VotePhase from "@/components/game/VotePhase";
import ResultPhase from "@/components/game/ResultPhase";
import WinnerPhase from "@/components/game/WinnerPhase";

const PHASE_COPY: Record<string, { label: string; hint: string }> = {
    setup: { label: "Crew Assembly", hint: "Lock in players & roles" },
    reveal: { label: "Word Reveal", hint: "Pass the device & peek" },
    clue: { label: "Clue Storm", hint: "One word. No panic." },
    vote: { label: "Interrogation", hint: "Point with confidence" },
    result: { label: "Exposure", hint: "See who got iced" },
    winner: { label: "Final Verdict", hint: "Reset or run it back" },
};

function PhaseStage() {
    const { phase } = useGame();

    return (
        <div className="glass-panel neon-border w-full p-6 sm:p-10 animate-[floaty_14s_ease-in-out_infinite]">
            {phase === "setup" && <SetupPhase />}
            {phase === "reveal" && <RevealPhase />}
            {phase === "clue" && <CluePhase />}
            {phase === "vote" && <VotePhase />}
            {phase === "result" && <ResultPhase />}
            {phase === "winner" && <WinnerPhase />}
        </div>
    );
}

function GameHud() {
    const { phase, players, undercoverCount, mrWhiteCount } = useGame();
    const phaseMeta = PHASE_COPY[phase] ?? { label: "Ready", hint: "Let's play" };

    return (
        <header className="glass-panel neon-border flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
            <div>
                <p className="retro-label text-xs text-cyan-200/80">current phase</p>
                <h1 className="text-3xl font-semibold uppercase tracking-wider text-white">
                    {phaseMeta.label}
                </h1>
                <p className="text-sm text-slate-300/70">{phaseMeta.hint}</p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center text-sm">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-lg backdrop-blur-sm">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-slate-300/70">players</p>
                    <p className="text-2xl font-semibold">{players.length}</p>
                </div>
                <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 shadow-lg">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-100/70">undercover</p>
                    <p className="text-2xl font-semibold text-cyan-200">{undercoverCount}</p>
                </div>
                <div className="rounded-2xl border border-fuchsia-400/20 bg-fuchsia-400/10 px-4 py-3 shadow-lg">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-fuchsia-100/70">mr. white</p>
                    <p className="text-2xl font-semibold text-fuchsia-200">{mrWhiteCount}</p>
                </div>
            </div>
        </header>
    );
}

function GameContent() {
    return (
        <main className="relative min-h-screen overflow-hidden px-4 py-10 text-white sm:px-6 lg:px-10">
            <div className="absolute inset-0 -z-10 opacity-80">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(34,211,238,0.4),transparent_55%),radial-gradient(circle_at_80%_0%,rgba(236,72,153,0.4),transparent_45%),radial-gradient(circle_at_50%_80%,rgba(248,113,113,0.35),transparent_50%)]" />
                <div className="absolute inset-0 mix-blend-screen opacity-30 blur-3xl bg-[conic-gradient(from_90deg_at_50%_50%,rgba(34,211,238,0.3),rgba(168,85,247,0.3),rgba(14,165,233,0.3))]" />
            </div>

            <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
                <GameHud />
                <PhaseStage />
            </div>
        </main>
    );
}

export default function GamePage() {
    return (
        <GameProvider>
            <GameContent />
        </GameProvider>
    );
}
