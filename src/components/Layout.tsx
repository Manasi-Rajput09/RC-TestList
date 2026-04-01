import { type ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Master List", path: "/master" },
    { name: "Archive", path: "/archive" },
    { name: "Analysis", path: "/analysis" },
  ];

  // Dark mode state with localStorage persistence
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#d15617] dark:bg-gradient-to-br dark:from-[#07162c] dark:to-[#030812] text-[#1a3826] dark:text-slate-200 font-sans selection:bg-[#1a3826] dark:selection:bg-[#176bd1] selection:text-white p-4 sm:p-6 lg:p-8 relative transition-colors duration-500">
      
      {/* Ambient Tech Glow (Only in Dark Mode) */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0 opacity-0 dark:opacity-100 transition-opacity duration-500">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-[#176bd1] rounded-full blur-[150px] opacity-30" />
        <div className="absolute bottom-[0%] right-[0%] w-[40%] h-[40%] bg-[#0ea5e9] rounded-full blur-[150px] opacity-20" />
      </div>

      {/* Styled Inner Container that morphs gracefully */}
      <div className="flex flex-col flex-1 w-full h-full bg-gradient-to-br from-[#fff8e7] via-[#fce6c8] to-[#f4d1a5] dark:bg-none dark:bg-[#0a162f]/60 dark:backdrop-blur-md rounded-[2rem] sm:rounded-[3rem] shadow-2xl overflow-hidden border-2 border-white/40 dark:border-white/10 relative z-10 transition-all duration-500">
        
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="absolute top-6 sm:top-8 right-6 sm:right-10 z-50 p-3 rounded-full bg-white/30 dark:bg-[#040C18]/60 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-sm transition-all hover:scale-110"
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? (
            <svg className="w-5 h-5 text-[#38bdf8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-[#d15617]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </button>

        {/* Main Content Area */}
        <main className="flex-1 w-full relative z-10 flex flex-col overflow-y-auto no-scrollbar dark:text-slate-100">
           {children}
        </main>

        {/* Static Bottom Navigation */}
        <div className="flex-none pt-4 pb-8 sm:pb-10 flex justify-center z-20">
           <nav className="bg-white/50 dark:bg-[#040C18]/60 backdrop-blur-xl dark:backdrop-blur-2xl border border-[#1a3826]/10 dark:border-white/10 rounded-full px-8 py-3.5 flex gap-6 sm:gap-10 shadow-sm dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] border-b-white/50 dark:border-t-white/15 dark:border-b-transparent transition-all duration-500">
             {navItems.map((item) => {
               const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
               return (
                 <Link
                   key={item.name}
                   to={item.path}
                   className={`text-[10px] sm:text-xs dark:text-xs sm:dark:text-sm font-bold tracking-widest uppercase transition-all duration-300 ${
                     isActive ? "text-[#d15617] dark:text-white dark:drop-shadow-[0_0_12px_rgba(56,189,248,1)] scale-105" : "text-[#1a3826]/50 dark:text-slate-300 hover:text-[#1a3826] dark:hover:text-white hover:scale-105"
                   }`}
                 >
                   {item.name}
                 </Link>
               );
             })}
           </nav>
        </div>
      </div>
    </div>
  );
}