import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { image, gender, occasion, weather, personalLibrary, mode } = await req.json();
    
    // Vercel Settings -> Environment Variables kısmına eklediğin key'i okur
    const apiKey = process.env.GEMINI_API_KEY; 
    
    if (!apiKey) {
      console.error("ANALYSIS_ERROR: API Key bulunamadı!");
      return NextResponse.json({ error: "API Key is missing in Vercel settings." }, { status: 500 });
    }

    if (!image) {
      return NextResponse.json({ error: "No image provided." }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Base64 verisindeki header kısmını temizler
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
          "logic": "Matching reason" 
        }
      ],
      "advice": "1 sentence style advice"
    }`;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Data, mimeType: "image/jpeg" } },
    ]);

    const responseText = result.response.text();
    // AI cevabının içindeki JSON kısmını ayıklar (```json gibi etiketleri temizler)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      console.error("ANALYSIS_ERROR: AI hatası ->", responseText);
      throw new Error("AI did not return a valid JSON format.");
    }

    return NextResponse.json(JSON.parse(jsonMatch[0]));
  } catch (error: any) {
    console.error("ANALYSIS_ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}