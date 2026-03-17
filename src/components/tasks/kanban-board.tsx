"use client";

import { useTasks } from "@/hooks/use-tasks";
import { useTaskStore } from "@/store/task-store";
import { useUIStore } from "@/store/ui-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Task } from "../../../types";
import { Grip } from "lucide-react";

const columns: Task["status"][] = ["todo", "in-progress", "done"];


// ✅ DRAG TYPE
const ITEM_TYPE = "TASK";


// ✅ TASK CARD
function TaskCard({ task }: { task: Task }) {
  const { setTask } = useTaskStore();

  const ref = useRef<HTMLDivElement | null>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPE,
    item: task,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // ✅ attach drag manually
  useEffect(() => {
    if (ref.current) {
      drag(ref);
    }
  }, [drag]);

  return (
    <div
      ref={ref}
      className={`flex justify-between bg-white p-3 rounded-lg mb-2 shadow transition cursor-move ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div
        onClick={() => setTask(task.id)}
        className="cursor-pointer w-[90%]"
      >
        {task.title}
      </div>

      <Grip className="w-5 text-gray-400" />
    </div>
  );
}


// ✅ COLUMN
function Column({
  status,
  tasks,
  onDropTask,
}: {
  status: Task["status"];
  tasks: Task[];
  onDropTask: (task: Task, status: Task["status"]) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ITEM_TYPE,
    drop: (item: Task) => onDropTask(item, status),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  // ✅ attach drop manually
  useEffect(() => {
    if (ref.current) {
      drop(ref);
    }
  }, [drop]);

  return (
    <div
      ref={ref}
      className={`p-4 rounded-xl min-h-[300px] ${
        isOver ? "bg-blue-100" : "bg-gray-100"
      }`}
    >
      <h2 className="font-bold mb-4 capitalize">
        {status.replace("-", " ")}
      </h2>

      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}


// ✅ MAIN BOARD
export default function KanbanBoard() {
  const { data: tasks = [] } = useTasks();
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const { selectedProject } = useUIStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const filteredTasks =
    selectedProject === "all"
      ? localTasks
      : localTasks.filter((t) => t.projectId === selectedProject);

  const mutation = useMutation({
    mutationFn: (task: Task) =>
      axios.put(`/api/tasks/${task.id}`, task),

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  // ✅ DROP HANDLER (SUPER CLEAN)
  const handleDrop = (task: Task, newStatus: Task["status"]) => {
    if (task.status === newStatus) return;

    // 🔥 instant UI update
    setLocalTasks((prev) =>
      prev.map((t) =>
        t.id === task.id ? { ...t, status: newStatus } : t
      )
    );

    // 🔥 backend sync
    mutation.mutate({
      ...task,
      status: newStatus,
    });
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {columns.map((col) => (
        <Column
          key={col}
          status={col}
          tasks={filteredTasks.filter((t) => t.status === col)}
          onDropTask={handleDrop}
        />
      ))}
    </div>
  );
}