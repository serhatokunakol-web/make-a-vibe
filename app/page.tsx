"use client";
import { useState } from "react";

export default function MakeAVibe() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [gender, setGender] = useState("Male");
  const [occasion, setOccasion] = useState("Date Night 🍷");
  const [weather, setWeather] = useState("Cold/Winter ❄️");
  
  // Favorilerin:
  const [library, setLibrary] = useState<string[]>(["Initio Side Effect", "JPG Le Male Elixir", "Cedrat Boise"]);
  const [newPerfume, setNewPerfume] = useState("");
  const [searchMode, setSearchMode] = useState("global");

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
        body: JSON.stringify({ image, gender, occasion, weather, personalLibrary: library, mode: searchMode }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e: any) { alert("Validation Error: " + e.message); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      <div className="max-w-md mx-auto space-y-6 pb-20">
        <header className="text-center italic font-black text-6xl tracking-tighter uppercase">MAKE A VIBE</header>
        
        <div className="flex bg-zinc-900 rounded-2xl p-1 border border-zinc-800">
          <button onClick={() => setSearchMode("global")} className={`flex-1 py-2 text-[10px] font-bold rounded-xl transition ${searchMode === "global" ? "bg-white text-black" : "text-zinc-500"}`}>GLOBAL</button>
          <button onClick={() => setSearchMode("personal")} className={`flex-1 py-2 text-[10px] font-bold rounded-xl transition ${searchMode === "personal" ? "bg-white text-black" : "text-zinc-500"}`}>MY LIBRARY</button>
        </div>

        <div className="bg-zinc-900/50 p-4 rounded-3xl border border-zinc-800 space-y-3">
          <div className="flex gap-2">
            <input value={newPerfume} onChange={(e) => setNewPerfume(e.target.value)} placeholder="Ekle..." className="flex-1 bg-black border border-zinc-800 p-2 rounded-xl text-xs outline-none" />
            <button onClick={() => { if(newPerfume) { setLibrary([...library, newPerfume]); setNewPerfume(""); } }} className="bg-white text-black px-4 rounded-xl font-bold">+</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {library.map(p => <span key={p} className="bg-black border border-zinc-800 px-3 py-1 rounded-full text-[9px] uppercase font-bold text-zinc-400">{p}</span>)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <select value={occasion} onChange={(e) => setOccasion(e.target.value)} className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-[10px] uppercase font-bold outline-none">{["Date Night 🍷", "Office/Work 💼", "Match Day ⚽"].map(o => <option key={o} value={o}>{o}</option>)}</select>
          <select value={weather} onChange={(e) => setWeather(e.target.value)} className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-[10px] uppercase font-bold outline-none">{["Cold/Winter ❄️", "Mediterranean Hot ☀️"].map(w => <option key={w} value={w}>{w}</option>)}</select>
        </div>

        <div onClick={() => document.getElementById('upload')?.click()} className="group relative border-2 border-dashed border-zinc-800 rounded-[2.5rem] p-12 text-center overflow-hidden cursor-pointer hover:border-zinc-500 transition-all shadow-2xl">
          {image && <img src={image} className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700" />}
          <input type="file" onChange={handleImage} className="hidden" id="upload" />
          <span className="relative z-10 text-[10px] font-black text-zinc-500 uppercase tracking-widest">{image ? "✓ KOMBİN YÜKLENDİ" : "+ KOMBİN EKLE"}</span>
        </div>

        {image && <button onClick={analyze} disabled={loading} className="w-full bg-white text-black font-black py-5 rounded-full text-xs tracking-widest uppercase shadow-2xl">{loading ? "VALIDATING MATRIX..." : `AURA PUANINI GÖR (${searchMode.toUpperCase()})`}</button>}

        {result && (
          <div className="mt-8 space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-8">
              <div className="space-y-1">
                <span className="text-zinc-600 text-[9px] uppercase font-black tracking-widest">Aura Score</span>
                <p className="text-zinc-400 text-[10px] font-mono leading-tight max-w-[200px] uppercase">{result.styleAnalysis}</p>
              </div>
              <span className="text-9xl font-black italic text-white leading-none">{result.auraScore}</span>
            </div>
            {result.recommendations?.map((rec: any, i: number) => (
              <div key={i} className="bg-zinc-900/40 p-6 rounded-[2rem] border border-zinc-900 group relative overflow-hidden transition-all hover:border-zinc-700">
                <div className="absolute top-6 right-8 text-right"><p className="text-yellow-500 font-black text-xl leading-none">{rec.score}</p><p className="text-zinc-600 text-[8px] uppercase font-bold">Fragrantica</p></div>
                <span className="text-[8px] text-zinc-600 uppercase font-mono tracking-widest">{rec.type}</span>
                <p className="text-2xl font-black text-white uppercase tracking-tighter pr-16 group-hover:text-yellow-500 transition-colors mt-1">{rec.perfumeName}</p>
                <p className="text-[9px] text-zinc-400 font-bold uppercase mb-4 flex items-center gap-2"><span className="bg-white/10 px-1.5 py-0.5 rounded">🏆 {rec.rank}</span></p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 py-4 border-y border-zinc-900">
                  <div className="flex justify-between items-center text-[8px] uppercase font-black text-zinc-600">Longevity <span className="text-[10px] text-white font-mono">{rec.metrics?.longevity}</span></div>
                  <div className="flex justify-between items-center text-[8px] uppercase font-black text-zinc-600">Sillage <span className="text-[10px] text-white font-mono">{rec.metrics?.sillage}</span></div>
                </div>
                <p className="text-[11px] text-zinc-400 italic leading-relaxed mt-4 border-l-2 border-zinc-800 pl-4">"{rec.logic}"</p>
                <a href={`https://www.fragrantica.com/search/?query=${encodeURIComponent(rec.perfumeName)}`} target="_blank" className="block text-center text-[8px] text-zinc-600 hover:text-white transition uppercase font-black tracking-widest border border-zinc-900 mt-4 py-2.5 rounded-xl">Full Report →</a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}