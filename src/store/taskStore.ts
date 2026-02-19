import { create } from "zustand";
import { Priority, TaskState } from "../types/types";
import { persist } from "zustand/middleware";

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],

      // Replace all tasks
      setTasks: (tasks) => set({ tasks }),

      // Add new task
      addTask: (task) => {
        const newTasks = [task, ...get().tasks];
        set({ tasks: newTasks });
      },

      // Complete a task with rules
      completeTask: (id) => {
        set({
          tasks: get().tasks.map((t) => {
            if (t.id !== id) return t;

            const now = new Date();

            // Rule 2: Locked task
            if (t.lockedUntil && now < t.lockedUntil) {
              alert("Hint: Time must pass.");
              return t;
            }

            // Rule 1: High priority depends on Low priority completed
            const priorityOrder: Record<Priority, Priority | null> = {
              Low: null,
              Medium: "Low",
              High: "Medium",
            };

            const requiredPriority = priorityOrder[t.priority];

            if (requiredPriority) {
              const hasCompleted = get().tasks.some(
                (task) => task.priority === requiredPriority && task.completed
              );
              if (!hasCompleted) {
                alert(`Hint: Complete a ${requiredPriority} task first.`);
                return t;
              }
            }

            // Rule 3: Odd minute restriction
            const createdMinute = t.createdAt.getMinutes();
            const timeElapsed = (now.getTime() - t.createdAt.getTime()) / 60000; // elapsed minutes

            if (createdMinute % 2 === 1 && timeElapsed > t.estimatedTime) {
              alert("Hint: Time has slipped away.");
              return t; // refuse to complete because allotted time passed
            }

            // Rule 4: Hidden refusal
            if (Math.random() < 0.1) {
              alert("Hint: Not all doors open.");
              return t;
            }

            return { ...t, completed: true };
          }),
        });
      },
    }),
    {
      name: "smart-tasks-storage", // Key in localStorage
      storage: {
        getItem: (name) => {
          const item = localStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value, (key, val) => {
            if (val instanceof Date) return val.toISOString();
            return val;
          }));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.tasks = state.tasks.map((t: any) => ({
            ...t,
            createdAt: new Date(t.createdAt),
            lockedUntil: t.lockedUntil ? new Date(t.lockedUntil) : undefined,
          }));
        }
      },
    }
  )
);