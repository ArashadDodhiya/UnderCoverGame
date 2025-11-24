import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import UsedWord from "@/models/UsedWord";
import fs from 'fs/promises';
import path from 'path';

type WordPair = { citizen: string; undercover: string };

export async function POST() {
    try {
        await dbConnect();

        // Read word pairs from JSON file
        const filePath = path.join(process.cwd(), 'data', 'word-pairs.json');
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const allPairs: WordPair[] = JSON.parse(fileContent);

        // Get used words from DB
        // We only need to check if the pair has been used recently or at all.
        // For 5000 pairs, we can probably just check if it exists in UsedWord.
        // However, if we want to support "reshuffling" after all are used, we might need more logic.
        // For now, let's just filter out used ones.

        // Optimization: Instead of fetching ALL used words (which could be large), 
        // we can pick a random pair and check if it's used, retry a few times.
        // Or if the list is small (like now ~200), we can fetch all used and filter.
        // Given the goal is 5000, fetching all might be heavy eventually, but for < 10000 it's fine.
        // Let's try the "pick random and check" approach for scalability, 
        // but "fetch all and filter" guarantees a unique one if available without infinite loops.

        // Let's go with "Fetch all used" for now as it's robust for < 10k items.
        const usedDocs = await UsedWord.find({}, { citizen: 1, undercover: 1 }).lean();
        const usedSet = new Set(usedDocs.map(d => `${d.citizen.toLowerCase()}|${d.undercover.toLowerCase()}`));

        // Filter available pairs
        const availablePairs = allPairs.filter(p =>
            !usedSet.has(`${p.citizen.toLowerCase()}|${p.undercover.toLowerCase()}`) &&
            !usedSet.has(`${p.undercover.toLowerCase()}|${p.citizen.toLowerCase()}`) // Check reverse too just in case
        );

        if (availablePairs.length === 0) {
            // Fallback: If all words used, maybe clear history or just pick random?
            // For now, let's pick a random one from allPairs and log a warning.
            console.warn("All word pairs have been used! Recycling words.");
            const randomPair = allPairs[Math.floor(Math.random() * allPairs.length)];
            // We don't save to UsedWord if we are recycling, or we do? 
            // If we recycle, we probably shouldn't block it again immediately, so maybe we don't save or we clear DB?
            // Let's just return it.
            return NextResponse.json(randomPair);
        }

        // Select random pair
        const selectedPair = availablePairs[Math.floor(Math.random() * availablePairs.length)];

        // Mark as used
        await UsedWord.create(selectedPair);

        return NextResponse.json(selectedPair);

    } catch (error) {
        console.error("Error generating words:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
