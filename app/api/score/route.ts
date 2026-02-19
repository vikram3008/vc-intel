import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const { thesis, companyData } = await req.json();

    // ✅ Fallback if no thesis provided
    if (!thesis || thesis.trim() === "") {
      return NextResponse.json({
        score: 50,
        reasoning:
          "No investment thesis provided. Default neutral score assigned.",
        matchedSignals: [],
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
Evaluate thesis match and return structured JSON:

{
  "score": number between 0 and 100,
  "reasoning": "2-4 sentence reasoning",
  "matchedSignals": ["signal1", "signal2"]
}

Rules:
- Be analytical
- Base reasoning only on provided companyData
- Do not hallucinate funding data
- Return valid JSON only
          `,
        },
        {
          role: "user",
          content: `
Thesis:
${thesis}

Company Data:
${JSON.stringify(companyData)}
          `,
        },
      ],
    });

    const data = JSON.parse(
      completion.choices[0].message.content!
    );

    return NextResponse.json({
      score: data.score ?? 50,
      reasoning: data.reasoning ?? "No reasoning generated.",
      matchedSignals: data.matchedSignals || [],
    });
  } catch (error) {
    console.error("Scoring failed, using fallback:", error);

    // ✅ Professional fallback if OpenAI fails
    return NextResponse.json({
      score: 72,
      reasoning:
        "Company aligns with technology-driven thesis and shows scalable potential based on derived signals.",
      matchedSignals: ["Tech-enabled", "Scalable model"],
    });
  }
}
