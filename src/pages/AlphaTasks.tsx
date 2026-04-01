import React, { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import type { Task } from "../types/task";

const STATUS_OPTIONS = [
  "PASS",
  "FAILED",
  "LOGGED",
  "UNDER_REVIEW",
  "DEPRECATED",
];

export default function AlphaTasks({ appId }: { appId: number }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [appName, setAppName] = useState("");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "UNDER_REVIEW",
    jira_ticket: "",
  });

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("application_id", appId)
      .order("created_at", { ascending: true });

    if (error) console.error("DB Fetch failed:", error.message);
    else setTasks(data || []);
  };

  const fetchAppName = async () => {
    const { data } = await supabase
      .from("applications")
      .select("name")
      .eq("id", appId)
      .single();

    if (data) setAppName(data.name);
  };

  useEffect(() => {
    fetchTasks();
    fetchAppName();
  }, [appId]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from("tasks").insert([
      { ...newTask, application_id: appId, jira_ticket: newTask.jira_ticket || "N/A" },
    ]);

    if (error) console.error("Insert failed:", error.message);
    else {
      setNewTask({ title: "", description: "", status: "UNDER_REVIEW", jira_ticket: "" });
      fetchTasks();
    }
  };

  const updateTaskStatus = async (id: number, newStatus: string) => {
    const { error } = await supabase.from("tasks").update({ status: newStatus }).eq("id", id);
    if (error) console.error("Update failed:", error.message);
    else fetchTasks();
  };

  const deleteTask = async (id: number) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) console.error("Delete failed:", error.message);
    else fetchTasks();
  };

  const activeTasks = tasks.filter((t) => t.status !== "DEPRECATED");
  const passedTasks = tasks.filter((t) => t.status === "PASS");

  const progress = activeTasks.length === 0 ? 0 : Math.round((passedTasks.length / activeTasks.length) * 100);
  const filteredTasks = filter === "ALL" ? tasks : tasks.filter((t) => t.status === filter);

  return (
    <>
      <div className="flex w-full max-w-[1600px] min-h-full text-[#1a3826] dark:text-slate-200 relative flex-col mx-auto px-4 sm:px-12 pb-24 transition-colors">
        
        {/* Header Section */}
        <div className="flex-none pt-8 sm:pt-12 pb-6 border-b border-[#1a3826]/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between transition-colors">
           <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
             <h1 className="text-2xl sm:text-3xl font-serif dark:font-sans italic dark:not-italic font-medium dark:font-bold text-[#1a3826] dark:text-white m-0 leading-none">
               Tracking
             </h1>
             <div className="flex items-baseline gap-3">
                <span className="font-sans font-bold dark:font-black tracking-[0.2em] uppercase text-[#d15617] dark:text-[#7dd3fc] text-xs sm:text-sm dark:text-sm sm:dark:text-base">{appName || 'APP'}</span>
                <span className="text-[10px] dark:text-xs font-bold tracking-[0.2em] uppercase text-[#1a3826]/40 dark:text-slate-400 hidden sm:inline-block">/ Live Dashboard</span>
             </div>
           </div>

           <div className="mt-4 sm:mt-0 flex items-center gap-6 bg-white/60 dark:bg-[#0a192f]/60 px-6 py-4 rounded-3xl border border-white dark:border-[#38bdf8]/20 shadow-sm dark:shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-colors">
             <div className="text-right">
                <p className="text-[10px] dark:text-xs font-bold tracking-widest uppercase text-[#1a3826]/60 dark:text-[#7dd3fc]">Total Progress</p>
                <p className="text-3xl dark:text-4xl font-black text-[#d15617] dark:text-white leading-none">{progress}%</p>
             </div>
             <div className="w-24 h-2 bg-[#1a3826]/10 dark:bg-[#020c1b] rounded-full overflow-hidden dark:border dark:border-white/5">
                <div className="h-full bg-[#d15617] dark:bg-gradient-to-r dark:from-[#176bd1] dark:to-[#38bdf8] dark:shadow-[0_0_10px_rgba(56,189,248,0.5)] transition-all duration-1000" style={{ width: `${progress}%` }}></div>
             </div>
           </div>
        </div>

        {/* Main Content Split */}
        <div className="flex-1 flex flex-col md:flex-row pb-12">
           
           {/* Left Sidebar: Controls & Filters */}
           <div className="w-full md:w-80 lg:w-96 flex-none bg-[#1a3826]/[0.02] dark:bg-[#020c1b]/30 border-r border-[#1a3826]/10 dark:border-white/10 p-8 sm:p-10 flex flex-col gap-10 transition-colors">
              
              {/* Add Task Form */}
              <div className="bg-white dark:bg-[#0a192f]/80 p-6 rounded-[2rem] shadow-sm border border-black/5 dark:border-white/5 transition-colors">
                 <h3 className="text-xs dark:text-sm font-bold dark:font-mono tracking-widest uppercase text-[#1a3826]/60 dark:text-[#7dd3fc] mb-4">Create New Task</h3>
                 <form onSubmit={handleAddTask} className="space-y-3">
                    <input
                       placeholder="Task Title..."
                       value={newTask.title}
                       onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                       className="w-full bg-[#1a3826]/5 dark:bg-[#020c1b]/50 border border-[#1a3826]/10 dark:border-white/10 text-[#1a3826] dark:text-slate-200 placeholder-[#1a3826]/40 dark:placeholder-slate-500 px-4 py-3 rounded-xl outline-none focus:bg-white dark:focus:bg-[#020c1b] focus:border-[#d15617]/50 dark:focus:border-[#38bdf8]/50 transition-all font-sans text-sm"
                       required
                    />
                    <input
                       placeholder="JIRA Ticket (Optional)"
                       value={newTask.jira_ticket}
                       onChange={(e) => setNewTask({ ...newTask, jira_ticket: e.target.value })}
                       className="w-full bg-[#1a3826]/5 dark:bg-[#020c1b]/50 border border-[#1a3826]/10 dark:border-white/10 text-[#1a3826] dark:text-slate-200 placeholder-[#1a3826]/40 dark:placeholder-slate-500 px-4 py-3 rounded-xl outline-none focus:bg-white dark:focus:bg-[#020c1b] focus:border-[#d15617]/50 dark:focus:border-[#38bdf8]/50 transition-all font-sans text-sm uppercase"
                    />
                    <button disabled={!newTask.title} className="w-full bg-[#1a3826] dark:bg-[#176bd1] text-white hover:bg-[#d15617] dark:hover:bg-[#38bdf8] disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-xl font-bold dark:font-mono tracking-widest uppercase text-xs transition-colors shadow-md mt-2 dark:shadow-[0_0_15px_rgba(23,107,209,0.4)]">
                       Add Task
                    </button>
                 </form>
              </div>


           </div>

           {/* Right Main Area: Task List */}
           <div className="flex-1 p-8 sm:p-10">
              <div className="max-w-4xl mx-auto flex items-center justify-between mb-8">
                 <h2 className="text-sm dark:text-base font-bold dark:font-mono tracking-widest uppercase text-[#1a3826]/80 dark:text-white">Project Tasks</h2>
                 <div className="relative">
                    <select
                       value={filter}
                       onChange={(e) => setFilter(e.target.value)}
                       className="appearance-none bg-white dark:bg-[#0a192f] text-[#1a3826] dark:text-[#38bdf8] px-5 py-2.5 pr-10 rounded-xl text-xs font-bold dark:font-mono tracking-widest uppercase border border-[#1a3826]/10 dark:border-[#38bdf8]/30 outline-none cursor-pointer shadow-sm hover:border-[#d15617]/50 dark:hover:border-[#38bdf8] transition-colors"
                    >
                       {["ALL", ...STATUS_OPTIONS].map((s) => (
                          <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                       ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#1a3826]/50 dark:text-[#38bdf8]/70">
                       <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                       </svg>
                    </div>
                 </div>
              </div>

              <div className="max-w-4xl mx-auto space-y-4 pb-12">
                 {filteredTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-[#0a192f]/50 border border-[#1a3826]/10 dark:border-white/10 rounded-[2rem] border-dashed transition-colors">
                       <p className="text-[#1a3826]/40 dark:text-slate-500 font-bold dark:font-mono uppercase tracking-widest text-sm">No tasks found matching filter</p>
                    </div>
                 ) : (
                    filteredTasks.map((task) => (
                       <div key={task.id} className="bg-white dark:bg-[#0a192f]/80 border border-[#1a3826]/10 dark:border-white/5 p-5 rounded-2xl shadow-sm hover:shadow-md dark:hover:shadow-[0_0_15px_rgba(56,189,248,0.1)] hover:border-[#d15617]/30 dark:hover:border-[#38bdf8]/30 transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          
                          <div className="flex-1">
                             <div className="flex items-center gap-3 mb-1">
                                <span className={`w-2 h-2 rounded-full ${task.status === 'PASS' ? 'bg-green-500 dark:bg-[#38bdf8] dark:shadow-[0_0_8px_rgba(56,189,248,0.8)]' : task.status === 'FAILED' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                                <span className="bg-[#1a3826]/5 dark:bg-[#38bdf8]/20 text-[#1a3826]/70 dark:text-[#e0f2fe] px-2 py-0.5 rounded text-[10px] dark:text-xs font-bold dark:font-mono tracking-widest uppercase transition-colors">
                                   {task.jira_ticket !== 'N/A' ? task.jira_ticket : 'NO JIRA'}
                                </span>
                             </div>
                             <h4 className="text-lg dark:text-xl font-bold text-[#1a3826] dark:text-white transition-colors">{task.title}</h4>
                          </div>

                          <div className="flex items-center gap-3 mt-4 sm:mt-0">
                             <select
                                value={task.status}
                                onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                                className="appearance-none bg-[#1a3826]/5 dark:bg-[#020c1b]/50 hover:bg-[#1a3826]/10 dark:hover:bg-[#020c1b]/80 text-[#1a3826] dark:text-slate-300 px-4 py-2 rounded-lg text-xs font-bold dark:font-mono tracking-widest uppercase border border-transparent outline-none cursor-pointer text-center transition-colors dark:border-white/5"
                                style={{ textAlignLast: 'center' }}
                             >
                                {STATUS_OPTIONS.map((s) => (
                                   <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                                ))}
                             </select>

                             <button
                                onClick={() => deleteTask(task.id)}
                                className="p-2 text-[#1a3826]/30 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                title="Delete Task"
                             >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                             </button>
                          </div>
                          {/* new change */}
                       </div>
                    ))
                 )}
              </div>
           </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </>
  );
}
