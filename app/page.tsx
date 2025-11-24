import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-16 text-white">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-60 blur-3xl bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.25),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(236,72,153,0.25),_transparent_45%)]" />
        <div className="absolute left-1/4 top-10 h-64 w-64 rounded-full bg-cyan-400/30 blur-[120px] animate-[floaty_8s_ease-in-out_infinite]" />
        <div className="absolute right-1/3 bottom-5 h-72 w-72 rounded-full bg-fuchsia-400/30 blur-[120px] animate-[floaty_10s_ease-in-out_infinite]" />
      </div>

      <section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-10 text-center">
        <p className="retro-label text-xs uppercase text-cyan-200 tracking-[0.35em]">
          undercover ai
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight drop-shadow-[0_0_25px_rgba(34,211,238,0.35)]">
          Gather your crew, guard your words,
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-fuchsia-400">
            smoke out the imposter.
          </span>
        </h1>
        <p className="max-w-2xl text-lg text-slate-200/80 md:text-xl">
          A high-energy party experience powered by AI-crafted word pairs, neon-streaked visuals, and
          infinite replay value. Pass the device, drop clues, and deceive your friends.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/game">
            <Button size="xl" className="min-w-[220px] text-lg">
              Launch Game
            </Button>
          </Link>
          <a
            href="https://en.wikipedia.org/wiki/Undercover_(party_game)"
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-white/20 px-6 py-4 text-sm uppercase tracking-[0.3em] text-white/70 transition hover:text-white hover:border-white/40"
          >
            learn the rules
          </a>
        </div>
      </section>
    </main>
  );
}
