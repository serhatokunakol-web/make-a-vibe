import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { image, gender, occasion, weather, personalLibrary, mode } = await req.json();
    
    // ÖNEMLİ: Vercel Settings -> Environment Variables kısmına GEMINI_API_KEY eklediğinden emin ol!
    const apiKey = process.env.GEMINI_API_KEY; 
    
    if (!apiKey) {
      return NextResponse.json({ error: "API Key is missing in Vercel settings." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const base64Data = image.includes(",") ? image.split(",")[1] : image;

    const modeInstruction = mode === "personal" 
      ? `CRITICAL: Suggest 3 perfumes ONLY from this list: [${personalLibrary.join(", ")}].`
      : `GLOBAL: Access Fragrantica database for 2025/2026 rankings.`;

    const prompt = `Analyze this ${gender}'s outfit for ${gender === 'Male' ? 'Starboy/Old Money' : 'Clean Girl/Quiet Luxury'} aesthetics.
    Occasion: ${occasion}, Weather: ${weather}. ${modeInstruction}

    Return ONLY JSON:
    {
      "auraScore": 0,
      "styleAnalysis": "...",
      "recommendations": [
        { 
          "type": "...", "perfumeName": "Brand - Name", "score": "4.XX", "rank": "...",
          "metrics": { "longevity": "X/10", "sillage": "X/10", "genderProfile": "...", "bestSeason": "..." },
          "notes": "...", "logic": "..." 
        }
      ],
      "advice": "..."
    }`;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Data, mimeType: "image/jpeg" } },
    ]);

    const responseText = result.response.text();
    // Regex ile JSON kısmını her türlü (markdown dahil) ayıklıyoruz
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) throw new Error("Invalid AI Response Format");

    return NextResponse.json(JSON.parse(jsonMatch[0]));
  } catch (error: any) {
    console.error("DEBUG_ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}