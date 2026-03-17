// src/components/tasks/KanbanBoard.tsx

"use client";

import {
  DndContext,
  closestCorners,
  DragEndEvent,
} from "@dnd-kit/core";
import { useTasks } from "@/hooks/useTasks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const columns = ["todo", "in-progress", "done"];

export default function KanbanBoard() {
  const { data: tasks = [] } = useTasks();
  const queryClient = useQueryClient();

  const updateTask = useMutation({
    mutationFn: (data: any) => axios.put(`/api/tasks/${data.id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const task = tasks.find((t: any) => t.id === active.id);
    if (!task) return;

    if (task.status !== over.id) {
      updateTask.mutate({
        ...task,
        status: over.id,
      });
    }
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-3 gap-4">
        {columns.map((col) => (
          <div
            key={col}
            id={col}
            className="bg-gray-100 p-4 rounded-xl min-h-[400px]"
          >
            <h2 className="font-bold capitalize mb-4">{col}</h2>

            {tasks
              .filter((task: any) => task.status === col)
              .map((task: any) => (
                <div
                  key={task.id}
                  className="bg-white p-3 rounded-lg mb-2 shadow cursor-grab"
                >
                  {task.title}
                </div>
              ))}
          </div>
        ))}
      </div>
    </DndContext>
  );
}