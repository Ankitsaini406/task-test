import { Task } from "../types/types";
import { Clock, Lock, CheckCircle, Circle, Timer } from "lucide-react";

interface TaskCardProps {
    task: Task;
    onComplete: (id: number) => void;
}

export default function TaskCard({ task, onComplete }: TaskCardProps) {
    const isLocked = task.lockedUntil && new Date() < task.lockedUntil;

    const priorityStyles: Record<string, string> = {
        Low: "bg-emerald-50 text-emerald-700 border-emerald-100",
        Medium: "bg-amber-50 text-amber-700 border-amber-100",
        High: "bg-rose-50 text-rose-700 border-rose-100",
    };

    const accentColors: Record<string, string> = {
        Low: "border-l-emerald-400",
        Medium: "border-l-amber-400",
        High: "border-l-rose-400",
    };

    return (
        <div
            className={`group relative flex flex-col md:flex-row justify-between items-start md:items-center p-5 mb-4 rounded-2xl border-l-4 shadow-sm border border-gray-100 
            transition-all duration-300 hover:shadow-md hover:-translate-y-0.5
            ${accentColors[task.priority]}
            ${task.completed ? "bg-gray-50/80 opacity-75" : isLocked ? "bg-gray-50 border-dashed border-gray-300" : "bg-white"}
            `}
        >
            {/* Task Info Section */}
            <div className="flex gap-4 items-start w-full">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className={`text-lg font-bold transition-colors ${task.completed ? "text-gray-500 line-through" : "text-slate-800"}`}>
                            {task.title}
                        </h3>
                        {isLocked && <Lock size={14} className="text-gray-400" />}
                    </div>

                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
                        {/* Priority Badge */}
                        <span className={`px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-lg border ${priorityStyles[task.priority]}`}>
                            {task.priority}
                        </span>

                        {/* Estimated Time */}
                        <div className="flex items-center gap-1.5 text-gray-500">
                            <Timer size={14} />
                            <span className="text-xs font-medium">{task.estimatedTime} mins</span>
                        </div>

                        {/* Timestamp */}
                        <div className="flex items-center gap-1.5 text-gray-400">
                            <Clock size={14} />
                            <span className="text-xs italic">{task.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>

                    {/* Lock Status Message */}
                    {isLocked && (
                        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-gray-200/50 rounded-md">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-tight">
                                Unlocks at {task.lockedUntil?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    )}
                </div>

                {/* Complete Button - Desktop Side / Mobile End */}
                <button
                    onClick={() => onComplete(task.id)}
                    disabled={task.completed || isLocked}
                    className={`shrink-0 flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all
                    ${task.completed 
                        ? "bg-emerald-100 text-emerald-600 cursor-default" 
                        : isLocked 
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                        : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100 active:scale-95"}
                    `}
                >
                    {task.completed ? (
                        <>
                            <CheckCircle size={18} strokeWidth={2.5} />
                            Done
                        </>
                    ) : isLocked ? (
                        <>
                            <Lock size={18} />
                            Locked
                        </>
                    ) : (
                        <>
                            <Circle size={18} strokeWidth={2.5} className="group-hover:hidden" />
                            <CheckCircle size={18} strokeWidth={2.5} className="hidden group-hover:block" />
                            Complete
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}