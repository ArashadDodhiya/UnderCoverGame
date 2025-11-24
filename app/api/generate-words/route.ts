import { NextResponse } from "next/server";
import groq from "@/lib/groq";
import dbConnect from "@/lib/mongodb";
import UsedWord from "@/models/UsedWord";

type WordPair = { citizen: string; undercover: string };

const FALLBACK_WORDS: WordPair[] = [
    { citizen: "pencil", undercover: "pen" },
    { citizen: "coffee", undercover: "tea" },
    { citizen: "wallet", undercover: "purse" },
    { citizen: "keyboard", undercover: "piano" },
    { citizen: "desert", undercover: "beach" },
    { citizen: "helmet", undercover: "hat" },
    { citizen: "panther", undercover: "tiger" },
    { citizen: "mirror", undercover: "window" },
    { citizen: "rocket", undercover: "missile" },
    { citizen: "lantern", undercover: "lamp" },
];

const MAX_GROQ_ATTEMPTS = 3;
const GROQ_TIMEOUT_MS = 8000;

export async function POST() {
    try {
        await dbConnect();
        const groqPair = await tryGroqGeneration();
        if (groqPair) {
            return NextResponse.json(groqPair);
        }

        const fallbackPair = await getFallbackPair();
        if (fallbackPair) {
            return NextResponse.json(fallbackPair);
        }

        return NextResponse.json({ error: "Unable to generate fresh words" }, { status: 500 });
    } catch (error) {
        console.error("Error generating words:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

async function tryGroqGeneration(): Promise<WordPair | null> {
    for (let attempt = 0; attempt < MAX_GROQ_ATTEMPTS; attempt++) {
        try {
            const pair = await withTimeout(generatePairFromGroq(), GROQ_TIMEOUT_MS);
            if (await isUniquePair(pair)) {
                await UsedWord.create(pair);
                return pair;
            }
        } catch (error) {
            console.warn(`Groq attempt ${attempt + 1} failed:`, error);
        }
    }
    return null;
}

async function getFallbackPair(): Promise<WordPair | null> {
    const choices = [...FALLBACK_WORDS];
    while (choices.length) {
        const index = Math.floor(Math.random() * choices.length);
        const [candidate] = choices.splice(index, 1);
        if (await isUniquePair(candidate)) {
            await UsedWord.create(candidate);
            return candidate;
        }
    }
    return null;
}

async function generatePairFromGroq(): Promise<WordPair> {
    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `Generate a pair of similar but different nouns for the game Undercover.
Difficulty: medium (daily objects, easy to describe).
Return ONLY JSON in this format: {"citizen": "word1", "undercover": "word2"}.
Do not include any other text.`,
            },
            {
                role: "user",
                content: "Generate a word pair.",
            },
        ],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
        throw new Error("Groq response missing content");
    }

    const parsed = JSON.parse(content);
    return {
        citizen: parsed.citizen,
        undercover: parsed.undercover,
    };
}

async function isUniquePair(pair: WordPair) {
    const exists = await UsedWord.findOne({
        $or: [
            { citizen: pair.citizen, undercover: pair.undercover },
            { citizen: pair.undercover, undercover: pair.citizen },
        ],
    }).lean();
    return !exists;
}

function withTimeout<T>(promise: Promise<T>, ms: number) {
    return new Promise<T>((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("Groq timeout")), ms);
        promise.then(
            (value) => {
                clearTimeout(timer);
                resolve(value);
            },
            (error) => {
                clearTimeout(timer);
                reject(error);
            }
        );
    });
}
