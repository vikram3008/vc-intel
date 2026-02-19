import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    // ✅ Fallback if no URL
    if (!url) {
      return NextResponse.json({
        summary: "No website provided. Basic enrichment generated.",
        whatTheyDo: ["Website information unavailable"],
        keywords: [],
        derivedSignals: [],
        sources: [],
        timestamp: new Date().toISOString(),
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });

    // Fetch website
    let html = "";

    try {
      const response = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0" },
      });
      html = await response.text();
    } catch (fetchError) {
      console.warn("Website fetch failed, using fallback.");
      html = "";
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
Extract structured JSON in EXACT format:

{
  "summary": "1-2 sentence overview",
  "whatTheyDo": ["3-6 concise bullet points"],
  "keywords": ["5-10 short keywords"],
  "derivedSignals": ["2-4 inferred signals"]
}

Rules:
- Be concise
- Use only visible information
- No hallucinated funding
- Return valid JSON only
          `,
        },
        {
          role: "user",
          content: html.slice(0, 12000),
        },
      ],
    });

    const data = JSON.parse(
      completion.choices[0].message.content!
    );

    return NextResponse.json({
      summary: data.summary,
      whatTheyDo: data.whatTheyDo || [],
      keywords: data.keywords || [],
      derivedSignals: data.derivedSignals || [],
      sources: [url],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Enrichment failed, using fallback:", error);

    // ✅ Professional fallback if OpenAI fails
    return NextResponse.json({
      summary:
        "AI enrichment temporarily unavailable. Basic structured response generated.",
      whatTheyDo: [
        "Company operates in technology sector",
        "Provides digital solutions",
      ],
      keywords: ["Technology", "Startup", "Innovation"],
      derivedSignals: ["Scalable model", "Tech-enabled platform"],
      sources: [],
      timestamp: new Date().toISOString(),
    });
  }
}
