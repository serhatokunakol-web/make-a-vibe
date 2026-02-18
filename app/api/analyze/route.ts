import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { image, gender, occasion, weather, personalLibrary, mode } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY; 
    
    if (!apiKey) return NextResponse.json({ error: "API Key is missing." }, { status: 500 });

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const base64Data = image.includes(",") ? image.split(",")[1] : image;
    const prompt = `Analyze this ${gender}'s outfit for Starboy/Old Money style. Return ONLY JSON: {"auraScore":0, "styleAnalysis":"...", "recommendations":[{"perfumeName":"...", "logic":"..."}]}`;

    const result = await model.generateContent([
      prompt, { inlineData: { data: base64Data, mimeType: "image/jpeg" } },
    ]);

    const resText = result.response.text();
    const jsonMatch = resText.match(/\{[\s\S]*\}/);
    return NextResponse.json(JSON.parse(jsonMatch![0]));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}