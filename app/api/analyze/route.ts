import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { image, gender, occasion, weather, personalLibrary, mode } = await req.json();
    
    // Vercel Settings -> Environment Variables kısmına GEMINI_API_KEY eklediğinden emin ol!
    const apiKey = process.env.GEMINI_API_KEY; 
    
    if (!apiKey) {
      return NextResponse.json({ error: "API Key is missing in server settings." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Base64 verisindeki header kısmını temizler
    const base64Data = image.includes(",") ? image.split(",")[1] : image;

    const modeInstruction = mode === "personal" 
      ? `CRITICAL VALIDATION: Suggest 3 perfumes ONLY from this list: [${personalLibrary.join(", ")}].`
      : `GLOBAL ACCESS: Suggest the best 3 matching perfumes in the world using 2025/2026 data.`;

    const prompt = `Analyze this ${gender}'s outfit for ${gender === 'Male' ? 'Starboy/Old Money' : 'Clean Girl/Quiet Luxury'} aesthetics.
    Context: Occasion: ${occasion}, Weather: ${weather}. ${modeInstruction}

    Return ONLY JSON:
    {
      "auraScore": 0,
      "styleAnalysis": "Brief architectural breakdown",
      "recommendations": [
        { 
          "type": "The Crowd-Pleaser", "perfumeName": "Brand - Name", "score": "4.XX", "rank": "#X in 2025/26",
          "metrics": { "longevity": "X/10", "sillage": "X/10", "genderProfile": "...", "bestSeason": "..." },
          "notes": "Top, Mid, Base", "logic": "Why it matches" 
        },
        { "type": "The Signature", "perfumeName": "...", "score": "...", "rank": "...", "metrics": {"longevity": "...", "sillage": "...", "genderProfile": "...", "bestSeason": "..."}, "notes": "...", "logic": "..." },
        { "type": "The Hidden Gem", "perfumeName": "...", "score": "...", "rank": "...", "metrics": {"longevity": "...", "sillage": "...", "genderProfile": "...", "bestSeason": "..."}, "notes": "...", "logic": "..." }
      ],
      "advice": "1 sentence style tip"
    }`;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Data, mimeType: "image/jpeg" } },
    ]);

    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) throw new Error("AI did not return a valid JSON.");

    return NextResponse.json(JSON.parse(jsonMatch[0]));
  } catch (error: any) {
    console.error("BUILD_ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}