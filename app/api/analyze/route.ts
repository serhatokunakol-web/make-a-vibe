import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { image, gender, occasion, weather, personalLibrary, mode } = await req.json();
    const apiKey = "AIzaSyDX4vitv1W8-Fz474vPKFum29JyjjgAQaI"; 
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const base64Data = image.includes(",") ? image.split(",")[1] : image;

    const modeInstruction = mode === "personal" 
      ? `CRITICAL: Suggest 3 perfumes ONLY from this list: [${personalLibrary.join(", ")}].`
      : `GLOBAL: Access Fragrantica database for 2025/2026 rankings.`;

    const prompt = `You are a Scent Scientist. Analyze the ${gender}'s outfit for ${gender === 'Male' ? 'Starboy/Old Money' : 'Clean Girl/Quiet Luxury'} aesthetics.
    Context: Occasion: ${occasion}, Setting: ${weather}.
    ${modeInstruction}

    Return ONLY JSON:
    {
      "auraScore": 0,
      "styleAnalysis": "Brief architectural breakdown",
      "recommendations": [
        { 
          "type": "The Crowd-Pleaser", 
          "perfumeName": "Brand - Name", 
          "score": "4.XX", 
          "rank": "#X in 2025/26",
          "metrics": { "longevity": "X/10", "sillage": "X/10", "genderProfile": "...", "bestSeason": "..." },
          "notes": "Top, Mid, Base", 
          "logic": "Matching logic" 
        },
        { "type": "The Signature", "perfumeName": "...", "score": "...", "rank": "...", "metrics": {"longevity": "...", "sillage": "...", "genderProfile": "...", "bestSeason": "..."}, "notes": "...", "logic": "..." },
        { "type": "The Hidden Gem", "perfumeName": "...", "score": "...", "rank": "...", "metrics": {"longevity": "...", "sillage": "...", "genderProfile": "...", "bestSeason": "..."}, "notes": "...", "logic": "..." }
      ],
      "advice": "1 sentence style advice"
    }`;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Data, mimeType: "image/jpeg" } },
    ]);

    const jsonMatch = result.response.text().match(/\{[\s\S]*\}/);
    return NextResponse.json(JSON.parse(jsonMatch![0]));
  } catch (error) {
    return NextResponse.json({ error: "Validation Failed" }, { status: 500 });
  }
}