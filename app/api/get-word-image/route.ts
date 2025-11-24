import { NextResponse } from "next/server";

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query) {
        return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
    }

    if (!UNSPLASH_ACCESS_KEY) {
        console.warn("UNSPLASH_ACCESS_KEY is missing");
        console.log("Current Environment Variables:", Object.keys(process.env));
        return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    try {
        const response = await fetch(
            `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&count=1`,
            {
                headers: {
                    Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Unsplash API error: ${response.statusText}`);
        }

        const data = await response.json();
        const image = data[0];

        return NextResponse.json({
            url: image.urls.regular,
            alt: image.alt_description || query,
            credit: {
                name: image.user.name,
                link: image.user.links.html,
            },
        });
    } catch (error) {
        console.error("Error fetching image:", error);
        return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 });
    }
}
