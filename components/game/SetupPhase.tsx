import { useState, useEffect, useCallback } from "react";
import { useGame } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, RefreshCcw, Users } from "lucide-react";

type WordPair = { citizen: string; undercover: string };

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 12;

export default function SetupPhase() {
    const { startGame } = useGame();
    const [playerCount, setPlayerCount] = useState(5);
    const [undercoverCount, setUndercoverCount] = useState(1);
    const [mrWhiteCount, setMrWhiteCount] = useState(0);
    const [names, setNames] = useState<string[]>(() => Array(5).fill(""));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [queuedWords, setQueuedWords] = useState<WordPair | null>(null);
    const [prefetching, setPrefetching] = useState(false);

    const clampPlayers = (count: number) => Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, count));

    const syncNames = (count: number) => {
        setNames((prev) => {
            if (count > prev.length) {
                return [...prev, ...Array(count - prev.length).fill("")];
            }
            return prev.slice(0, count);
        });
    };

    const adjustPlayerCount = (next: number) => {
        const safe = clampPlayers(next);
        setPlayerCount(safe);
        syncNames(safe);
        if (undercoverCount >= safe) {
            setUndercoverCount(Math.max(1, safe - 1));
        }
        if (mrWhiteCount >= safe - undercoverCount) {
            setMrWhiteCount(Math.max(0, safe - undercoverCount - 1));
        }
    };

    const handleNameChange = (index: number, value: string) => {
        setNames((prev) => prev.map((name, i) => (i === index ? value : name)));
    };

    const prefetchWords = useCallback(async () => {
        setPrefetching(true);
        try {
            const res = await fetch("/api/generate-words", { method: "POST" });
            if (!res.ok) throw new Error("Word fetch failed");
            const words = await res.json();
            setQueuedWords(words);
        } catch (err) {
            console.warn("Prefetch skipped:", err);
        } finally {
            setPrefetching(false);
        }
    }, []);

    useEffect(() => {
        prefetchWords();
    }, [prefetchWords]);

    const handleStart = async () => {
        if (names.some((n) => !n.trim())) {
            setError("Give every player a codename.");
            return;
        }
        if (undercoverCount + mrWhiteCount >= playerCount) {
            setError("Too many impostors for this squad.");
            return;
        }

        setError("");
        setLoading(true);
        try {
            let words = queuedWords;
            if (!words) {
                const res = await fetch("/api/generate-words", { method: "POST" });
                if (!res.ok) throw new Error("Failed to generate new words");
                words = await res.json();
            }
            startGame(names, undercoverCount, mrWhiteCount, words);
            setQueuedWords(null);
            prefetchWords();
        } catch (err) {
            console.error("Error starting game:", err);
            setError(`Mission abort. ${err instanceof Error ? err.message : ""}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="space-y-10 text-white">
            <div className="text-center space-y-3">
                <p className="retro-label text-[11px] uppercase text-cyan-200/80">mission briefing</p>
                <h2 className="text-3xl font-semibold">Assemble your squad</h2>
                <p className="text-sm text-slate-300/80">
                    Tune the lobby, name your agents, and let the AI forge a fresh secret word pair.
                </p>
                <p className="text-xs text-cyan-200/80">
                    {queuedWords ? "Word pair locked & cached" : prefetching ? "Synthesizing word pair..." : "Waiting for word pair"}
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-6 rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="retro-label text-[10px] text-slate-300/70">TOTAL PLAYERS</p>
                            <p className="text-4xl font-semibold">{playerCount}</p>
                        </div>
                        <Users className="h-12 w-12 text-white/40" />
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => adjustPlayerCount(playerCount - 1)}
                            className="flex-1 rounded-2xl border border-white/10 py-3 text-2xl font-semibold transition hover:border-white/40 hover:text-white"
                        >
                            −
                        </button>
                        <button
                            type="button"
                            onClick={() => adjustPlayerCount(playerCount + 1)}
                            className="flex-1 rounded-2xl border border-white/10 py-3 text-2xl font-semibold transition hover:border-white/40 hover:text-white"
                        >
                            +
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <CountBadge
                            label="Undercovers"
                            value={undercoverCount}
                            onChange={(value) => setUndercoverCount(Math.max(1, Math.min(value, playerCount - 1)))}
                        />
                        <CountBadge
                            label="Mr. White"
                            value={mrWhiteCount}
                            onChange={(value) => setMrWhiteCount(Math.max(0, Math.min(value, playerCount - undercoverCount - 1)))}
                        />
                    </div>
                </div>

                <div className="rounded-3xl border border-white/5 bg-gradient-to-br from-slate-900/80 to-slate-900/50 p-6 backdrop-blur space-y-4">
                    <p className="retro-label text-[10px] uppercase tracking-[0.35em] text-slate-400/70">
                        player aliases
                    </p>
                    <div className="grid max-h-[360px] gap-3 overflow-y-auto pr-1">
                        {names.map((name, index) => (
                            <Input
                                key={index}
                                value={name}
                                onChange={(event) => handleNameChange(index, event.target.value)}
                                placeholder={`Agent ${index + 1}`}
                                className="border-white/10 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-cyan-300"
                            />
                        ))}
                    </div>
                </div>
            </div>

            {error && (
                <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {error}
                </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
                <Button className="flex-1 text-base" size="xl" onClick={handleStart} disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-3 h-5 w-5 animate-spin" /> syncing intel...
                        </>
                    ) : (
                        "Lock & Start"
                    )}
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="xl"
                    disabled={prefetching}
                    onClick={prefetchWords}
                    className="flex-1 border border-white/20 text-base text-white/80 hover:text-white"
                >
                    <RefreshCcw className="mr-3 h-4 w-4" />
                    {prefetching ? "Refreshing..." : "New word pair"}
                </Button>
            </div>
        </section>
    );
}

function CountBadge({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400/80">{label}</p>
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => onChange(Math.max(0, value - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-xl transition hover:border-white/40"
                >
                    −
                </button>
                <p className="text-2xl font-semibold">{value}</p>
                <button
                    type="button"
                    onClick={() => onChange(value + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-xl transition hover:border-white/40"
                >
                    +
                </button>
            </div>
        </div>
    );
}
