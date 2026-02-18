"use client";
import { useState } from "react";

export default function MakeAVibe() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [gender, setGender] = useState("Male");
  const [occasion, setOccasion] = useState("Date Night 🍷");
  const [weather, setWeather] = useState("Cold/Winter ❄️");
  
  const [library, setLibrary] = useState<string[]>(["Initio Side Effect", "JPG Le Male Elixir", "Dior Sauvage Elixir", "Cedrat Boise"]);
  const [newPerfume, setNewPerfume] = useState("");
  const [searchMode, setSearchMode] = useState("global");

  const handleImage = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const addPerfume = () => {
    if (newPerfume.trim() && !library.includes(newPerfume)) {
      setLibrary([...library, newPerfume.trim()]);
      setNewPerfume("");
    }
  };

  const analyze = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({ image, gender, occasion, weather, personalLibrary: library, mode: searchMode }),
      });
      setResult(await res.json());
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-6 font-sans selection:bg-white selection:text-black">
      <div className="max-w-md mx-auto space-y-6 pb-20">
        <header className="text-center space-y-1">
          <h1 className="text-6xl font-black italic tracking-tighter text-white uppercase">MAKE A VIBE</h1>
          <p className="text-zinc-600 text-[10px] uppercase font-black tracking-[0.4em]">Scent Validation & Analytics</p>
        </header>

        <div className="flex bg-zinc-900 rounded-2xl p-1 border border-zinc-800">
          <button onClick={() => setSearchMode("global")} className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition ${searchMode === "global" ? "bg-white text-black scale-95" : "text-zinc-500"}`}>GLOBAL</button>
          <button onClick={() => setSearchMode("personal")} className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition ${searchMode === "personal" ? "bg-white text-black scale-95" : "text-zinc-500"}`}>MY LIBRARY</button>
        </div>

        <div className="bg-zinc-900/50 p-5 rounded-[2.5rem] border border-zinc-800 space-y-4">
          <div className="flex gap-2">
            <input value={newPerfume} onChange={(e) => setNewPerfume(e.target.value)} placeholder="Parfüm ekle..." className="flex-1 bg-black border border-zinc-800 p-3 rounded-xl text-xs outline-none focus:border-white transition" />
            <button onClick={addPerfume} className="bg-white text-black px-5 rounded-xl text-xs font-black">+</button>
          </div>
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto pr-2">
            {library.map(p => (
              <span key={p} className="bg-black border border-zinc-800 px-3 py-1.5 rounded-full text-[8px] uppercase font-black text-zinc-400 flex items-center gap-2">
                {p} <button onClick={() => setLibrary(library.filter(i => i !== p))} className="text-red-900 font-black">×</button>
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <select value={occasion} onChange={(e) => setOccasion(e.target.value)} className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-[10px] uppercase font-black outline-none transition">
            {["Date Night 🍷", "Office/Work 💼", "Match Day ⚽", "Party/Clubbing 🕺", "Beach/Summer ☀️"].map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <select value={weather} onChange={(e) => setWeather(e.target.value)} className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-[10px] uppercase font-black outline-none transition">
            {["Cold/Winter ❄️", "Mediterranean Hot ☀️", "Rainy/Autumn 🌧️", "Mild/Spring 🌸"].map(w => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>

        <div className="flex bg-zinc-900 rounded-full p-1 border border-zinc-800">
          {["Male", "Female"].map((g) => (
            <button key={g} onClick={() => setGender(g)} className={`flex-1 py-2 text-[10px] font-black rounded-full transition ${gender === g ? "bg-white text-black scale-95" : "text-zinc-500"}`}>{g.toUpperCase()}</button>
          ))}
        </div>

        <div className="group relative border-2 border-dashed border-zinc-800 rounded-[2.5rem] p-12 text-center hover:border-zinc-500 transition-all overflow-hidden">
          {image && <img src={image} className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700" />}
          <input type="file" onChange={handleImage} className="hidden" id="upload" />
          <label htmlFor="upload" className="cursor-pointer relative z-10 flex flex-col items-center space-y-3">
            <span className="text-4xl">📸</span>
            <span className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.3em] group-hover:text-white transition">{image ? "✓ KOMBİN YÜKLENDİ" : "+ KOMBİN EKLE"}</span>
          </label>
        </div>

        {image && (
          <button onClick={analyze} disabled={loading} className="w-full bg-white text-black font-black py-5 rounded-full active:scale-95 transition text-[11px] tracking-[0.2em] shadow-2xl shadow-white/5 uppercase">
            {loading ? "VALIDATING MATRIX..." : `AURA PUANINI GÖR (${searchMode.toUpperCase()})`}
          </button>
        )}

        {result && (
          <div className="mt-4 space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-8">
              <div className="space-y-1">
                <span className="text-zinc-600 text-[9px] uppercase font-black tracking-widest">Aura Score</span>
                <p className="text-zinc-400 text-[10px] font-mono leading-tight max-w-[200px] uppercase">{result.styleAnalysis}</p>
              </div>
              <span className="text-9xl font-black italic tracking-tighter text-white drop-shadow-2xl">{result.auraScore}</span>
            </div>
            
            <div className="space-y-6">
              {result.recommendations?.map((rec: any, i: number) => (
                <div key={i} className="bg-zinc-900/30 p-6 rounded-[2.5rem] border border-zinc-900 hover:border-zinc-700 transition-all group relative">
                  <div className="absolute top-6 right-8 text-right">
                    <p className="text-yellow-500 font-black text-xl leading-none">{rec.score}</p>
                    <p className="text-zinc-600 text-[7px] uppercase font-bold">Fragrantica</p>
                  </div>
                  
                  <span className="text-[8px] text-zinc-600 uppercase font-mono tracking-widest">{rec.type}</span>
                  <p className="text-2xl font-black text-white mt-1 uppercase tracking-tighter pr-16 group-hover:text-yellow-500 transition-colors">{rec.perfumeName}</p>
                  
                  <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="bg-white/10 px-1.5 py-0.5 rounded">🏆 {rec.rank}</span>
                  </p>

                  <p className="text-[10px] text-zinc-500 font-mono mb-4 leading-tight uppercase tracking-tighter">{rec.notes}</p>
                  
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 py-4 border-y border-zinc-900">
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] text-zinc-600 uppercase font-black">Longevity</span>
                      <span className="text-[10px] text-white font-mono">{rec.metrics?.longevity}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] text-zinc-600 uppercase font-black">Sillage</span>
                      <span className="text-[10px] text-white font-mono">{rec.metrics?.sillage}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] text-zinc-600 uppercase font-black">Vibe</span>
                      <span className="text-[10px] text-yellow-500 font-mono">{rec.metrics?.genderProfile}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] text-zinc-600 uppercase font-black">Season</span>
                      <span className="text-[10px] text-blue-400 font-mono">{rec.metrics?.bestSeason}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-relaxed italic mt-4 mb-4 border-l-2 border-zinc-800 pl-4">"{rec.logic}"</p>
                  
                  <a href={`https://www.fragrantica.com/search/?query=${encodeURIComponent(rec.perfumeName)}`} target="_blank" className="block text-center text-[8px] text-zinc-600 hover:text-white transition uppercase font-black tracking-[0.2em] border border-zinc-900 py-2.5 rounded-xl">
                    Full Fragrantica Report →
                  </a>
                </div>
              ))}
            </div>

            <div className="bg-white text-black p-8 rounded-[2.5rem] shadow-2xl text-center">
              <p className="text-xs font-bold italic leading-relaxed tracking-tight">"{result.advice}"</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}