"use client";

import { useTasks } from "@/hooks/use-tasks";
import { useTaskStore } from "@/store/task-store";
import { useUIStore } from "@/store/ui-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useMemo, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Task } from "../../../types";
import { Grip, HandIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";


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
      className={`flex items-center justify-between rounded-lg mb-2 pr-3 bg-muted shadow transition cursor-move border border-transparent hover:border-blue-500 group ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div
        onClick={() => setTask(task.id)}
        className="cursor-pointer w-[90%] h-full py-3 pl-3 truncate group-hover:text-blue-600"
      >
        {task.title}
      </div>

      {isDragging ? <HandIcon className="w-5 text-gray-400" /> : <Grip className="w-5 text-gray-400" />}
    </div>
  );
}


// ✅ COLUMN
function Column({
  status,
  tasks,
  onDropTask,
  isPending,
  isError,
}: {
  status: Task["status"];
  tasks: Task[];
  onDropTask: (task: Task, status: Task["status"]) => void;
  isPending: boolean;
  isError: boolean;
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
  // console.log("tasks: ", tasks);

  return (
    <div
      ref={ref}
      className={`p-4 rounded-xl min-h-[300px] ${
        isOver
          ? "bg-blue-100 border-2 border-blue-300 border-dashed"
          : "bg-white"
      }`}
    >
      <h2 className="font-bold mb-4 capitalize">
        {status.replace("-", " ")}
      </h2>

      {/* LOADING */}
      {isPending && (
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      )}

      {/* ERROR */}
      {!isPending && isError && (
        <p className="text-sm text-red-500">
          Failed to load tasks
        </p>
      )}

      {/* EMPTY */}
      {!isPending && !isError && tasks.length === 0 && (
        <p className="text-sm text-gray-400">No tasks here</p>
      )}

      {/* SUCCESS */}
      {!isPending &&
        !isError &&
        tasks.length > 0 &&
        tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
    </div>
  );
}


// ✅ MAIN BOARD
export default function KanbanBoard() {
  const { selectedProject } = useUIStore();
  const {
    data: tasks = [],
    isPending,
    isError,
    error,
  } = useTasks(selectedProject);
  const queryClient = useQueryClient();

  const filteredTasks =
    selectedProject === "all"
      ? tasks
      : tasks.filter((t: Task) => t.projectId === selectedProject);

  // console.log("selectedProject: ", selectedProject);
  const mutation = useMutation({
    mutationFn: async (task: Task) => {
      const res = await axios.put(`/api/tasks/${task.id}`, task);
      return res.data.task;
    },

    onMutate: async (updatedTask) => {
      const queryKey = ["tasks", selectedProject];

      await queryClient.cancelQueries({ queryKey });

      const previousTasks =
        queryClient.getQueryData<Task[]>(queryKey);

      queryClient.setQueryData<Task[]>(queryKey, (old = []) =>
        old.map((t) =>
          t.id === updatedTask.id
            ? { ...t, status: updatedTask.status }
            : t
        )
      );

      return { previousTasks, queryKey };
    },

    onError: (_err, _updatedTask, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(
          context.queryKey,
          context.previousTasks
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", selectedProject],
      });
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
          isPending={isPending}
          isError={isError}
        />
      ))}
    </div>
  );
}