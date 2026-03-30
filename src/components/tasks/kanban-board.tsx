"use client";

import { useTasks } from "@/hooks/use-tasks";
import { useTaskStore } from "@/store/task-store";
import { useUIStore } from "@/store/ui-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
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

  const dragItem = useMemo(() => task, [task]);
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: dragItem,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  useEffect(() => {
    if (ref.current) drag(ref);
  }, [drag]);

  return (
    <div
      ref={ref}
      className={`flex items-center justify-between rounded-lg mb-2 pr-3 bg-muted shadow transition cursor-move ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div
        onClick={() => setTask(task.id)}
        className="cursor-pointer w-[90%] h-full py-3 pl-3"
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
        isOver ? "bg-blue-100 border-2 border-blue-300 border-dashed " : "bg-white"
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
  const { selectedProject } = useUIStore();
  const queryClient = useQueryClient();

  const filteredTasks =
    selectedProject === "all"
      ? tasks
      : tasks.filter((t: Task) => t.projectId === selectedProject);

  const mutation = useMutation({
    mutationFn: (task: Task) =>
      axios.put(`/api/tasks/${task.id}`, task),

    onMutate: async (updatedTask) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

      queryClient.setQueryData<Task[]>(["tasks"], (old = []) =>
        old.map((t) =>
          t.id === updatedTask.id ? updatedTask : t
        )
      );

      return { previousTasks };
    },

    onError: (_err, _updatedTask, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleDrop = (task: Task, newStatus: Task["status"]) => {
    if (task.status === newStatus) return;

    mutation.mutate({ ...task, status: newStatus });
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {columns.map((col) => (
        <Column
          key={col}
          status={col}
          tasks={filteredTasks.filter((t: Task) => t.status === col)}
          onDropTask={handleDrop}
        />
      ))}
    </div>
  );
}