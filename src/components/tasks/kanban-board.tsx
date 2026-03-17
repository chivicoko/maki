"use client";

import { useTasks } from "@/hooks/use-tasks";
import {
  DndContext,
  closestCorners,
  DragEndEvent,
  useDroppable,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Task } from "../../../types";
import { useTaskStore } from "@/store/task-store";
import { useUIStore } from "@/store/ui-store";
import { Grip } from "lucide-react";
import { useEffect, useState } from "react";

const columns = ["todo", "in-progress", "done"];


// ✅ COLUMN (DROPPABLE FIX)
function Column({ id, children }: { id: string; children: React.ReactNode;}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`p-4 rounded-xl min-h-[300px] transition ${
        isOver ? "bg-blue-100" : "bg-gray-100"
      }`}
    >
      {children}
    </div>
  );
}


// ✅ TASK CARD (CLICK FIX INCLUDED)
function SortableTask({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const { setTask } = useTaskStore();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex justify-between bg-white p-3 rounded-lg mb-2 shadow hover:shadow-md transition"
    >
      {/* ✅ CLICK AREA */}
      <div
        onClick={() => setTask(task.id)}
        className="cursor-pointer w-[90%]"
      >
        {task.title}
      </div>

      {/* ✅ DRAG HANDLE (VERY IMPORTANT) */}
      <Grip 
        {...attributes}
        {...listeners}
        className="h-full min-h-12 w-7 border rounded-sm text-xs text-gray-400 mt- cursor-grab " 
      />
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

  // ✅ FILTER
  const filteredTasks =
    selectedProject === "all"
      ? localTasks
      : localTasks.filter((t: Task) => t.projectId === selectedProject);

  // ✅ MUTATION
  const mutation = useMutation({
    mutationFn: (task: Task) =>
      axios.put(`/api/tasks/${task.id}`, task),

    onMutate: async (updatedTask) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previous = queryClient.getQueryData<Task[]>(["tasks"]);

      queryClient.setQueryData(["tasks"], (old: Task[] = []) =>
        old.map((t) =>
          t.id === updatedTask.id
            ? { ...t, status: updatedTask.status }
            : t
        )
      );

      return { previous };
    },

    onError: (_err, _newTask, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["tasks"], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  // ✅ DRAG FIX
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const task = localTasks.find((t) => t.id === active.id);
    if (!task) return;

    let newStatus: Task["status"] | null = null;

    if (columns.includes(over.id as string)) {
      newStatus = over.id as Task["status"];
    } else {
      const overTask = localTasks.find((t) => t.id === over.id);
      if (overTask) newStatus = overTask.status;
    }

    if (!newStatus || task.status === newStatus) return;

    // ✅ INSTANT UI UPDATE (THIS FIXES SNAP BACK)
    setLocalTasks((prev) =>
      prev.map((t) =>
        t.id === task.id ? { ...t, status: newStatus! } : t
      )
    );

    // ✅ THEN sync to backend
    mutation.mutate({
      ...task,
      status: newStatus,
    });
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-3 gap-4">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter(
            (t: Task) => t.status === col
          );

          return (
            <Column key={col} id={col}>
              <h2 className="font-bold mb-4 capitalize">
                {col.replace("-", " ")}
              </h2>

              <SortableContext
                items={colTasks.map((t: Task) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                {colTasks.map((task: Task) => (
                  <SortableTask key={task.id} task={task} />
                ))}
              </SortableContext>
            </Column>
          );
        })}
      </div>
    </DndContext>
  );
}