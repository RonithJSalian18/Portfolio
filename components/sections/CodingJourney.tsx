"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Generate heatmap data once to prevent hydration mismatch
function useHeatmapData() {
  const [data, setData] = useState<number[]>([]);
  useEffect(() => {
    const arr = [];
    for (let i = 0; i < 364; i++) {
      const isActive = Math.random() < 0.67; // ~244 active days out of 364
      arr.push(isActive ? Math.floor(Math.random() * 4) + 1 : 0);
    }
    setData(arr);
  }, []);
  return data;
}

export default function CodingJourney() {
  const heatmapData = useHeatmapData();

  return (
    <section id="mission" className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-outfit font-black text-white mb-4 tracking-tight">
              MISSION <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-green">CONTROL</span>
            </h2>
            <p className="text-text-muted font-mono uppercase tracking-widest text-xs">
              Live algorithmic performance & telemetry array.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Radar Panel */}
            <div className="col-span-1 border border-white/10 bg-[#050b14] rounded-2xl p-6 relative overflow-hidden group shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.05)_0,transparent_70%)] opacity-50 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                <span className="text-white font-mono text-xs uppercase tracking-wider flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse shadow-[0_0_10px_rgba(0,229,255,0.8)]" />
                  Terminal Status
                </span>
                <span className="text-accent-green font-mono text-xs font-bold border border-accent-green/30 bg-accent-green/10 px-2 py-0.5 rounded shadow-[0_0_10px_rgba(57,211,83,0.2)]">ONLINE</span>
              </div>

              <div className="flex flex-col items-center justify-center py-8">
                <div className="relative w-48 h-48 flex items-center justify-center">
                  {/* Radar rings */}
                  <div className="absolute inset-0 rounded-full border border-accent-cyan/20 border-dashed animate-[spin_60s_linear_infinite]" />
                  <div className="absolute inset-4 rounded-full border border-accent-cyan/10" />
                  <div className="absolute inset-8 rounded-full border border-accent-cyan/5 border-dashed" />
                  <motion.div 
                    className="absolute inset-0 origin-center bg-[conic-gradient(from_0deg,transparent_0deg,rgba(0,229,255,0.1)_90deg,transparent_90deg)] rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  />
                  
                  {/* Center Stat */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-[#050b14] rounded-full m-12 backdrop-blur-sm border border-accent-cyan/20 shadow-[0_0_20px_rgba(0,229,255,0.2)]">
                    <span className="text-3xl font-black text-white font-outfit">328</span>
                    <span className="text-[9px] text-accent-cyan font-mono tracking-widest mt-1">SOLVED</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between text-xs font-mono px-2 pt-4">
                <div className="text-center flex flex-col items-center">
                  <span className="text-accent-green text-xl font-bold mb-1 drop-shadow-[0_0_5px_rgba(57,211,83,0.8)]">207</span>
                  <span className="text-text-muted text-[10px] tracking-wider">EASY</span>
                </div>
                <div className="text-center flex flex-col items-center">
                  <span className="text-yellow-400 text-xl font-bold mb-1 drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]">120</span>
                  <span className="text-text-muted text-[10px] tracking-wider">MED</span>
                </div>
                <div className="text-center flex flex-col items-center">
                  <span className="text-accent-pink text-xl font-bold mb-1 drop-shadow-[0_0_5px_rgba(255,78,205,0.8)]">1</span>
                  <span className="text-text-muted text-[10px] tracking-wider">HARD</span>
                </div>
              </div>
            </div>

            {/* Right Dashboard Area */}
            <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
              
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "SUBMISSIONS", value: "710", unit: "1 YEAR", border: "group-hover:border-t-accent-cyan" },
                  { label: "ACTIVE DAYS", value: "244", unit: "DAYS", border: "group-hover:border-t-accent-green" },
                  { label: "MAX STREAK", value: "33", unit: "DAYS", border: "group-hover:border-t-yellow-400" },
                  { label: "GLOBAL RANK", value: "408k", unit: "TOP", border: "group-hover:border-t-accent-purple" }
                ].map((metric, i) => (
                  <div key={i} className={`border border-white/5 border-t-2 border-t-transparent bg-[#050b14] rounded-xl p-5 relative flex flex-col justify-between group transition-all duration-300 hover:shadow-lg ${metric.border} overflow-hidden`}>
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="text-[10px] text-text-muted font-mono tracking-widest uppercase mb-4 relative z-10">{metric.label}</div>
                    <div className="flex items-baseline gap-2 relative z-10">
                      <div className="text-3xl font-black font-outfit text-white">{metric.value}</div>
                      <div className="text-[10px] text-text-muted font-mono">{metric.unit}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Massive Heatmap Component */}
              <div className="border border-white/10 bg-[#0d1117] rounded-2xl p-6 relative flex-1 flex flex-col justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                  <h3 className="text-white font-outfit font-bold text-lg flex items-center gap-2">
                    <span className="w-3 h-3 rounded-[3px] bg-accent-green shadow-[0_0_10px_rgba(57,211,83,0.8)]" />
                    Activity Heatmap
                  </h3>
                  
                  <div className="text-xs font-mono text-text-muted flex items-center gap-4">
                    <div className="hidden md:block">
                      <span className="text-white font-bold text-sm">710</span> submissions in the past one year
                    </div>
                    
                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-md border border-white/10">
                      <span>Less</span>
                      <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-[2px] bg-[#161b22] border border-white/5" />
                        <div className="w-3 h-3 rounded-[2px] bg-[#0e4429]" />
                        <div className="w-3 h-3 rounded-[2px] bg-[#006d32]" />
                        <div className="w-3 h-3 rounded-[2px] bg-[#26a641]" />
                        <div className="w-3 h-3 rounded-[2px] bg-[#39d353]" />
                      </div>
                      <span>More</span>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto pb-4 scrollbar-hide">
                  <div className="min-w-[800px]">
                    <div className="flex gap-2 text-[10px] text-text-muted font-mono mb-2 ml-8">
                      {["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"].map((m, i) => (
                        <div key={i} className="flex-1 text-center">{m}</div>
                      ))}
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="flex flex-col justify-between text-[10px] text-text-muted font-mono py-1 h-[108px]">
                        <span>Mon</span>
                        <span>Wed</span>
                        <span>Fri</span>
                      </div>
                      
                      <div className="flex-1 grid grid-rows-7 grid-flow-col gap-[3px]">
                        {heatmapData.length > 0 ? heatmapData.map((level, idx) => {
                          let colorClass = "bg-[#161b22] border border-white/5";
                          if (level === 1) colorClass = "bg-[#0e4429] border border-[#006d32]/30";
                          if (level === 2) colorClass = "bg-[#006d32] shadow-[0_0_4px_rgba(0,109,50,0.5)] border border-[#26a641]/50";
                          if (level === 3) colorClass = "bg-[#26a641] shadow-[0_0_8px_rgba(38,166,65,0.7)]";
                          if (level === 4) colorClass = "bg-[#39d353] shadow-[0_0_12px_rgba(57,211,83,0.9)]";

                          return (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.2, delay: (idx % 52) * 0.01 }}
                              className={`w-3.5 h-3.5 rounded-[2px] cursor-pointer hover:scale-150 hover:z-10 transition-transform duration-200 ${colorClass}`}
                              title={`Activity level: ${level}`}
                            />
                          );
                        }) : (
                          // Loading skeleton
                          Array.from({length: 364}).map((_, i) => (
                            <div key={i} className="w-3.5 h-3.5 rounded-[2px] bg-[#161b22] border border-white/5 animate-pulse" />
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
