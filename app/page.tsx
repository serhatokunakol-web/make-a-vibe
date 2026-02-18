"use client";
import { useState } from "react";

export default function MakeAVibe() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleImage = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!image) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({ image }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e: any) { 
      alert("Validation Error: " + e.message); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      <div className="max-w-md mx-auto space-y-6 pb-20">
        <header className="text-center italic font-black text-6xl tracking-tighter uppercase">MAKE A VIBE</header>
        <div onClick={() => document.getElementById('upload')?.click()} className="group relative border-2 border-dashed border-zinc-800 rounded-[2.5rem] p-12 text-center cursor-pointer overflow-hidden shadow-2xl">
          {image && <img src={image} className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale" />}
          <input type="file" onChange={handleImage} className="hidden" id="upload" />
          <span className="relative z-10 text-[10px] font-black text-zinc-500 uppercase tracking-widest">{image ? "✓ KOMBİN YÜKLENDİ" : "+ KOMBİN EKLE"}</span>
        </div>
        {image && (
          <button onClick={analyze} disabled={loading} className="w-full bg-white text-black font-black py-5 rounded-full text-xs tracking-widest uppercase">
            {loading ? "VALIDATING MATRIX..." : "AURA PUANINI GÖR"}
          </button>
        )}
        {result && (
          <div className="mt-8 space-y-4 animate-in fade-in">
            <span className="text-9xl font-black italic block text-center border-b border-zinc-900 pb-8">{result.auraScore}</span>
          </div>
        )}
      </div>
    </div>
  );
}