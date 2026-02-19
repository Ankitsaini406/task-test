export type Priority = "Low" | "Medium" | "High";

export interface Task {
    id: number;
    title: string;
    priority: Priority;
    estimatedTime: number; // in minutes
    createdAt: Date;
    completed: boolean;
    lockedUntil?: Date;
}

export interface TaskState {
    tasks: Task[];
    addTask: (task: Task) => void;
    completeTask: (id: number) => void;
}