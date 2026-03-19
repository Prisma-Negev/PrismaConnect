import React, { useState } from "react";
import { CheckCircle, CheckSquare, Clock, Edit2, GripVertical, ListTodo, PlayCircle, Plus, RefreshCw, Save, Sparkles, Square, Trash2, User as UserIcon, Users, Wand2, X } from "lucide-react";
import { useCreate, useDataProvider, useDelete, useGetIdentity, useGetList, useNotify, useUpdate } from "ra-core";
import type { Task, Sale } from "../types";

// simplified Tooltip component for embedded use if needed
const SimpleTooltip = ({ text, children }: { text: string; children: React.ReactNode }) => (
    <div className="group relative flex items-center">
        {children}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max max-w-xs bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg z-50">
            {text}
        </div>
    </div>
);

type KanbanStatus = "todo" | "inprogress" | "done";

const KANBAN_COLUMNS: { id: KanbanStatus; title: string; icon: any; color: string; bgColor: string }[] = [
    { id: "todo", title: "לביצוע", icon: Clock, color: "text-amber-500", bgColor: "bg-amber-50 border-amber-200" },
    { id: "inprogress", title: "בביצוע", icon: PlayCircle, color: "text-blue-500", bgColor: "bg-blue-50 border-blue-200" },
    { id: "done", title: "הושלם", icon: CheckCircle, color: "text-emerald-500", bgColor: "bg-emerald-50 border-emerald-200" },
];

const getTaskStatus = (task: Task): KanbanStatus => {
    if (task.completed) return "done";
    if (task.note && task.note.includes("[IN_PROGRESS]")) return "inprogress";
    return "todo";
};

export const DealTasksKanban = ({ dealId }: { dealId: string }) => {
    const notify = useNotify();
    const dataProvider = useDataProvider();
    const { identity } = useGetIdentity();
    const currentUserId = identity?.id as string;
    
    // Fetch tasks for this deal
    const { data: tasks, isLoading, refetch } = useGetList<Task>("tasks", {
        pagination: { page: 1, perPage: 100 },
        sort: { field: "due_date", order: "ASC" },
        filter: { deal_id: dealId },
    });

    // Fetch team members (sales)
    const { data: teamMembers } = useGetList<Sale>("sales", {
        pagination: { page: 1, perPage: 100 },
        sort: { field: "first_name", order: "ASC" },
    });

    const [create] = useCreate<Task>();
    const [update] = useUpdate<Task>();
    const [deleteOne] = useDelete<Task>();

    const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
    const [filter, setFilter] = useState<"all" | "mine">("all");

    // Derived Data
    const safeTasks = tasks || [];
    const filteredTasks = safeTasks.filter((t) => {
        if (filter === "mine") return t.sales_id === currentUserId;
        return true;
    });

    const getTasksForColumn = (status: KanbanStatus) => {
        return filteredTasks.filter((t) => getTaskStatus(t) === status);
    };

    // Handlers
    const handleDragStart = (e: React.DragEvent, taskId: string) => {
        setDraggedTaskId(taskId);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e: React.DragEvent, targetStatus: KanbanStatus) => {
        e.preventDefault();
        if (!draggedTaskId) return;
        
        const task = safeTasks.find((t) => t.id === draggedTaskId);
        if (!task) return;

        const currentStatus = getTaskStatus(task);
        if (currentStatus !== targetStatus) {
            let newCompleted = task.completed;
            let newNote = task.note || "";

            if (targetStatus === "done") {
                newCompleted = true;
                newNote = newNote.replace("[IN_PROGRESS]", "").trim();
            } else if (targetStatus === "inprogress") {
                newCompleted = false;
                if (!newNote.includes("[IN_PROGRESS]")) {
                    newNote = "[IN_PROGRESS] " + newNote;
                }
            } else if (targetStatus === "todo") {
                newCompleted = false;
                newNote = newNote.replace("[IN_PROGRESS]", "").trim();
            }

            // Optimistic Update
            update("tasks", { id: task.id, data: { completed: newCompleted, note: newNote }, previousData: task }, {
                onSuccess: () => refetch(),
                onError: () => notify("resources.tasks.notifications.update_error", { type: "error" })
            });
        }
        setDraggedTaskId(null);
    };

    const handleToggleTask = (task: Task) => {
        const newCompleted = !task.completed;
        let newNote = task.note || "";
        if (newCompleted) {
            newNote = newNote.replace("[IN_PROGRESS]", "").trim();
        }
        update("tasks", { id: task.id, data: { completed: newCompleted, note: newNote }, previousData: task }, {
            onSuccess: () => refetch()
        });
    };

    const handleDeleteTask = (task: Task) => {
        if (!window.confirm("בטוח שברצונך למחוק משימה זו?")) return;
        deleteOne("tasks", { id: task.id, previousData: task }, {
            onSuccess: () => {
                notify("resources.tasks.notifications.deleted");
                refetch();
            }
        });
    };

    if (isLoading) return <div className="p-8 text-center text-slate-500 text-sm">טוען משימות לוח...</div>;

    return (
        <div className="space-y-6 bg-slate-50 p-4 rounded-xl border border-slate-200 mt-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <ListTodo className="text-primary" /> משימות קנבן (Kanban)
                </h3>
                <div className="bg-white p-1 rounded-lg shadow-sm border border-slate-200 flex text-sm">
                    <button
                        onClick={() => setFilter("mine")}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-md font-medium transition-all ${filter === "mine" ? "bg-primary text-white shadow" : "text-slate-500 hover:bg-slate-50"}`}
                    >
                        <UserIcon size={14} /> שלי
                    </button>
                    <button
                        onClick={() => setFilter("all")}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-md font-medium transition-all ${filter === "all" ? "bg-primary text-white shadow" : "text-slate-500 hover:bg-slate-50"}`}
                    >
                        <Users size={14} /> כולם
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 overflow-x-auto pb-4 min-h-[300px]" dir="rtl">
                {KANBAN_COLUMNS.map((col) => {
                    const columnTasks = getTasksForColumn(col.id);
                    return (
                        <div
                            key={col.id}
                            className={`min-w-[280px] flex-1 rounded-xl border flex flex-col transition-all ${col.bgColor} ${draggedTaskId ? "border-dashed border-2" : ""}`}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, col.id)}
                        >
                            <div className="p-3 border-b border-slate-200/50 bg-white/50 backdrop-blur rounded-t-xl flex items-center justify-between">
                                <div className="flex items-center gap-2 font-bold text-slate-700 text-sm">
                                    <col.icon size={18} className={col.color} />
                                    {col.title}
                                </div>
                                <span className="bg-white text-slate-600 text-xs px-2 py-0.5 rounded-full font-mono border border-slate-200">
                                    {columnTasks.length}
                                </span>
                            </div>

                            <div className="p-3 flex-1 overflow-y-auto space-y-3">
                                {columnTasks.length === 0 && (
                                    <div className="flex flex-col items-center justify-center text-center py-8 px-4 opacity-50">
                                        <div className="text-sm font-medium">אין משימות</div>
                                        <span className="text-xs">גרור משימות לכאן</span>
                                    </div>
                                )}
                                {columnTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, task.id)}
                                        className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 hover:border-slate-300 hover:shadow transition-all group cursor-grab active:cursor-grabbing"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <button
                                                onClick={() => handleToggleTask(task)}
                                                className={`mt-0.5 flex-shrink-0 transition-colors ${task.completed ? "text-emerald-500" : "text-slate-300 hover:text-primary"}`}
                                            >
                                                {task.completed ? <CheckSquare size={16} /> : <Square size={16} />}
                                            </button>
                                            <div className={`flex-1 text-sm font-medium leading-tight ${task.completed ? "line-through text-slate-400" : "text-slate-800"}`}>
                                                {task.text}
                                            </div>
                                            <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleDeleteTask(task)} className="text-slate-300 hover:text-red-500" title="מחק">
                                                    <Trash2 size={14} />
                                                </button>
                                                <GripVertical size={14} className="text-slate-200 cursor-grab" />
                                            </div>
                                        </div>
                                        {task.note && task.note.replace("[IN_PROGRESS]", "").trim() !== "" && (
                                            <div className="text-xs text-slate-500 mt-2 bg-slate-50 p-2 rounded border border-slate-100 whitespace-pre-wrap">
                                                {task.note.replace("[IN_PROGRESS]", "").trim()}
                                            </div>
                                        )}
                                        <div className="mt-3 flex items-center justify-between">
                                            {task.sales_id && teamMembers && (
                                                <div className="text-[11px] font-medium bg-slate-100 px-2 py-0.5 rounded-full text-slate-600 border border-slate-200 flex items-center gap-1">
                                                    <UserIcon size={10} />
                                                    {teamMembers.find((m) => m.id === task.sales_id)?.first_name || task.sales_id}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* We can add Quick Add Task Inline Here later */}
        </div>
    );
};
