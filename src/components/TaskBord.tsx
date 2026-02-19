"use client";

import { useState, useMemo } from "react";
import { Priority, Task } from "../types/types";
import TaskCard from "./TaskCard";
import { Plus, Clock, BarChart3, CheckCircle2, Calendar, Layout } from 'lucide-react';
import { useTaskStore } from "../store/taskStore";

export default function TaskBoard() {
    const tasks = useTaskStore((state) => state.tasks);
    const addTask = useTaskStore((state) => state.addTask);
    const completeTask = useTaskStore((state) => state.completeTask);

    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState<Priority>("Low");
    const [estimatedTime, setEstimatedTime] = useState(15);

    // Dynamic Stats Logic
    const stats = useMemo(() => {
        const completed = tasks.filter(t => t.completed).length;
        const total = tasks.length;
        const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
        const pendingTime = tasks
            .filter(t => !t.completed)
            .reduce((acc, t) => acc + t.estimatedTime, 0);

        return { progress, pendingTime, total };
    }, [tasks]);

    const handleAddTask = () => {
        if (!title) return;

        const now = new Date();
        const recentTasks = tasks.filter(
            (t) => now.getTime() - t.createdAt.getTime() <= 2 * 60 * 1000
        );
        const isLocked = recentTasks.length >= 3;

        const newTask: Task = {
            id: Date.now(),
            title,
            priority,
            estimatedTime,
            createdAt: now,
            completed: false,
            lockedUntil: isLocked ? new Date(now.getTime() + 5 * 60 * 1000) : undefined,
        };

        addTask(newTask);
        setTitle("");
        setEstimatedTime(15);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 md:p-12 font-sans text-slate-900">
            <div className="max-w-6xl mx-auto">

                {/* Header & Dynamic Stats */}
                <header className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-indigo-600 p-2 rounded-xl text-white">
                                <Layout size={24} />
                            </div>
                            <h1 className="text-4xl font-black tracking-tight text-slate-900">
                                Task Board
                            </h1>
                        </div>
                        <p className="text-slate-500 flex items-center gap-2 font-medium ml-1">
                            <Calendar size={18} className="text-indigo-500" /> 
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 px-6 min-w-40">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                <BarChart3 size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Progress</p>
                                <p className="text-xl font-bold text-slate-800">{stats.progress}%</p>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 px-6 min-w-40">
                            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                                <Clock size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Workload</p>
                                <p className="text-xl font-bold text-slate-800">{stats.pendingTime}m</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Left Column: Form */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-8 bg-white p-8 rounded-4xl shadow-xl shadow-slate-200/60 border border-slate-100">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                    <Plus size={20} strokeWidth={3} />
                                </div>
                                <h2 className="text-xl font-extrabold text-slate-800">Add Task</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block ml-1">Task Title</label>
                                    <input
                                        type="text"
                                        placeholder="Enter task name..."
                                        className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white p-4 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-slate-300 font-medium"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block ml-1">Priority</label>
                                        <select
                                            value={priority}
                                            onChange={(e) => setPriority(e.target.value as Priority)}
                                            className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white p-4 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none appearance-none font-bold text-slate-700"
                                        >
                                            <option>Low</option>
                                            <option>Medium</option>
                                            <option>High</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block ml-1">Mins</label>
                                        <input
                                            type="number"
                                            value={estimatedTime}
                                            onChange={(e) => setEstimatedTime(Number(e.target.value))}
                                            className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white p-4 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-slate-700"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleAddTask}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl shadow-lg shadow-indigo-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 mt-4"
                                >
                                    <Plus size={20} strokeWidth={3} />
                                    CREATE TASK
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: The actual Task List */}
                    <div className="lg:col-span-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                                Your Focus <span className="text-indigo-600 ml-2 text-lg font-bold bg-indigo-50 px-3 py-1 rounded-full">{stats.total}</span>
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {tasks.length === 0 ? (
                                <div className="text-center py-24 bg-white rounded-4xl border-2 border-dashed border-slate-200 shadow-inner">
                                    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 className="text-slate-300" size={40} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800">No tasks found</h3>
                                    <p className="text-slate-400 mt-1 font-medium">Use the form on the left to start your day.</p>
                                </div>
                            ) : (
                                // Correctly using the TaskCard component here
                                tasks.map((task) => (
                                    <TaskCard 
                                        key={task.id} 
                                        task={task} 
                                        onComplete={completeTask} 
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}