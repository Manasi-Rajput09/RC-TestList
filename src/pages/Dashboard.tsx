import { useEffect, useState, useRef } from "react";
import { supabase } from "../supabase-client";

type AppSummary = {
  id: number;
  name: string;
  progress: number;
};

// Dreamy CSS gradients inspired by the reference image
const DREAMY_GRADIENTS = [
  "bg-gradient-to-b from-[#1b3a2a] via-[#3a634b] to-[#b4d3a4]", // Green pond vibe
  "bg-gradient-to-br from-[#203a43] via-[#436c7a] to-[#8faaaa]", // Deep blue underwater
  "bg-gradient-to-b from-[#6b7042] via-[#a39f60] to-[#ecd7a1]", // Yellow floral swirl
  "bg-gradient-to-b from-[#0a192f] via-[#1c3f60] to-[#5a86a8]", // Sunlit deep water
  "bg-gradient-to-b from-[#8c5042] via-[#b37765] to-[#e8c0b5]"  // Soft sunset blooms
];

// Techy deep blue gradients for dark mode
const TECH_GRADIENTS = [
  "dark:bg-gradient-to-br dark:from-[#0A192F] dark:to-[#112240]",
  "dark:bg-gradient-to-br dark:from-[#020C1B] dark:to-[#0A192F]",
  "dark:bg-gradient-to-br dark:from-[#0F172A] dark:to-[#1E293B]",
  "dark:bg-gradient-to-br dark:from-[#0B1A30] dark:to-[#162A45]",
  "dark:bg-gradient-to-br dark:from-[#040C18] dark:to-[#0D1B2A]"
];

export default function Dashboard() {
  const [apps, setApps] = useState<AppSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const fetchData = async () => {
    setLoading(true);

    const { data: applications, error: appError } = await supabase
      .from("applications")
      .select("*");

    if (appError) {
      console.error(appError.message);
      setLoading(false);
      return;
    }

    const results: AppSummary[] = [];

    for (const app of applications || []) {
      const { data: tasks, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("application_id", app.id);

      if (error) {
        console.error(error.message);
        continue;
      }

      const active = tasks.filter((t) => t.status !== "DEPRECATED");
      const passed = tasks.filter((t) => t.status === "PASS");

      const progress =
        active.length === 0
          ? 0
          : Math.round((passed.length / active.length) * 100);

      results.push({
        id: app.id,
        name: app.name,
        progress,
      });
    }

    setApps(results);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col w-full h-full relative">
      <div className="flex-none pt-10 px-10 sm:px-14 z-20 select-none">
        <h1 className="text-xl sm:text-2xl dark:text-2xl sm:dark:text-3xl leading-none m-0 flex items-baseline gap-2 pb-2 transition-all">
          <span className="font-serif dark:font-sans italic dark:not-italic font-medium dark:font-bold tracking-normal dark:tracking-wide text-[#1a3826] dark:text-white drop-shadow-sm dark:drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">Release</span>
          <span className="font-sans font-bold dark:font-black tracking-[0.2em] uppercase text-[#d15617] dark:text-[#7dd3fc] text-xs sm:text-sm dark:text-sm sm:dark:text-base drop-shadow-sm dark:drop-shadow-[0_0_10px_rgba(125,211,252,0.8)]">CANDIDATES</span>
        </h1>
      </div>

      <div className="flex-1 w-full relative group flex items-center">
        {/* Left Scroll Button */}
        <button 
          onClick={() => scroll('left')}
          className="absolute left-2 sm:left-6 z-30 bg-white/40 hover:bg-white/60 backdrop-blur-md p-3 sm:p-4 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.1)] opacity-0 group-hover:opacity-100 transition-all duration-300 text-[#1a3826] hover:scale-110 disabled:opacity-0"
          aria-label="Scroll left"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right Scroll Button */}
        <button 
          onClick={() => scroll('right')}
          className="absolute right-2 sm:right-6 z-30 bg-white/40 hover:bg-white/60 backdrop-blur-md p-3 sm:p-4 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.1)] opacity-0 group-hover:opacity-100 transition-all duration-300 text-[#1a3826] hover:scale-110 disabled:opacity-0"
          aria-label="Scroll right"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div ref={scrollRef} className="w-full h-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory flex scroll-smooth no-scrollbar relative">
          <div className="flex w-max min-w-full h-full items-center justify-evenly gap-8 sm:gap-12 px-10 sm:px-14 pb-4">
        {loading && (
          <div className="flex animate-pulse space-x-4 items-center text-white/70 font-medium h-[55vh] max-h-[550px] w-[320px] shrink-0 bg-white/10 rounded-[2.5rem] border border-white/20 justify-center">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {!loading && apps.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[55vh] max-h-[550px] w-[320px] shrink-0 bg-white/5 backdrop-blur-sm rounded-[2.5rem] border border-white/20">
            <p className="text-white/70 text-lg font-medium">No applications found.</p>
          </div>
        )}

        {!loading && apps.map((app, index) => {
          const lightGradient = DREAMY_GRADIENTS[index % DREAMY_GRADIENTS.length];
          const darkGradient = TECH_GRADIENTS[index % TECH_GRADIENTS.length];
          return (
            <div
              key={app.id}
              onClick={() => (window.location.href = `/app/${app.id}`)}
              className={`group relative h-[60vh] max-h-[550px] min-h-[420px] w-[300px] sm:w-[340px] shrink-0 snap-center rounded-[2.5rem] shadow-xl dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] cursor-pointer overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:hover:shadow-[0_0_30px_rgba(56,189,248,0.2)] border-4 border-white/10 dark:border dark:border-[#38bdf8]/20 ${lightGradient} ${darkGradient}`}
            >
              {/* Subtle Overlay */}
              <div className="absolute inset-0 bg-black/10 dark:bg-black/20 mix-blend-overlay dark:mix-blend-normal pointer-events-none transition-all"></div>
              
              {/* Soft Blooms (Light) / Neon Glows (Dark) */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 dark:bg-[#38bdf8] rounded-full mix-blend-overlay dark:mix-blend-screen filter blur-3xl dark:blur-[80px] opacity-40 dark:opacity-10 pointer-events-none dark:group-hover:opacity-20 transition-all duration-700"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 dark:bg-[#176bd1] rounded-full mix-blend-overlay dark:mix-blend-screen filter blur-3xl dark:blur-[80px] opacity-30 dark:opacity-10 pointer-events-none dark:group-hover:opacity-20 transition-all duration-700"></div>

              <div className="relative z-10 flex flex-col h-full justify-between p-8 text-white dark:text-slate-100 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-8">
                     {/* Modern minimalist tech icon */}
                     <div className="w-14 h-14 rounded-2xl bg-white/20 dark:bg-[#0a192f]/50 backdrop-blur-md border border-white/30 dark:border-[#38bdf8]/30 flex items-center justify-center shadow-md dark:shadow-[0_0_15px_rgba(56,189,248,0.1)] dark:group-hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all">
                        <svg className="w-7 h-7 text-white dark:text-[#38bdf8] drop-shadow-sm dark:drop-shadow-[0_0_5px_rgba(56,189,248,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                     </div>
                     <span className="px-3 py-1.5 rounded-full bg-white/10 dark:bg-[#38bdf8]/20 backdrop-blur-md border border-white/20 dark:border-[#38bdf8]/40 text-[10px] dark:text-xs font-bold dark:font-mono tracking-widest uppercase opacity-90 dark:opacity-100 dark:text-[#e0f2fe] transition-colors">
                        App {app.id}
                     </span>
                  </div>

                  <h2 className="font-serif dark:font-sans italic dark:not-italic text-3xl dark:text-4xl leading-tight font-medium dark:font-bold mb-1 dark:mb-3 drop-shadow-sm dark:text-white dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] dark:group-hover:text-[#e0f2fe] transition-colors">
                    {app.name}
                  </h2>
                  <p className="text-white/80 dark:text-[#7dd3fc] font-sans dark:font-mono font-light dark:font-medium tracking-wide dark:tracking-wider text-sm dark:text-sm uppercase transition-colors">
                    Status & Tracking
                  </p>
                </div>
                
                <div className="mt-auto bg-white/10 dark:bg-[#020c1b]/60 backdrop-blur-md border border-white/20 dark:border-[#38bdf8]/40 p-5 rounded-3xl shadow-md dark:shadow-[0_5px_15px_rgba(0,0,0,0.5)] relative overflow-hidden transition-all">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 dark:from-[#38bdf8]/10 to-transparent pointer-events-none"></div>
                  <div className="flex justify-between items-end mb-3 relative z-10">
                    <p className="text-white/70 dark:text-[#e0f2fe] font-bold text-[10px] dark:text-xs tracking-widest uppercase transition-colors">Progress</p>
                    <span className="text-2xl dark:text-3xl font-sans font-black tracking-tighter drop-shadow-sm dark:text-white transition-colors">
                      {app.progress}<span className="text-base text-white/70 dark:text-slate-300">%</span>
                    </span>
                  </div>

                  {/* Clean Progress Bar */}
                  <div className="w-full bg-black/10 dark:bg-[#0a192f] rounded-full h-1.5 shadow-inner overflow-hidden relative z-10 dark:border dark:border-white/5">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out relative bg-white dark:bg-gradient-to-r dark:from-[#176bd1] dark:to-[#38bdf8] dark:shadow-[0_0_10px_rgba(56,189,248,0.5)]"
                      style={{ width: `${app.progress}%` }}
                    >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
          </div>
        </div>
      </div>
    </div>
  );
}
