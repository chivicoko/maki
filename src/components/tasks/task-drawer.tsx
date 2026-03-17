// src/components/tasks/TaskDrawer.tsx

"use client";

import { useTasks } from "@/hooks/use-tasks";
import { useTaskStore } from "@/store/task-store";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function TaskDrawer() {
  const { selectedTaskId, setTask } = useTaskStore();
  const { data: tasks = [] } = useTasks();

  const task = tasks.find((t: any) => t.id === selectedTaskId);

  return (
    <Sheet open={!!selectedTaskId} onOpenChange={() => setTask(null)}>
      <SheetContent side="right" className="w-[400px]">
        {task && (
          <>
            <SheetHeader>
              <SheetTitle>{task.title}</SheetTitle>
            </SheetHeader>
            <hr />
            <div className="px-4 space-y-2">
              <p className="text-sm text-gray-500">
                Status: {task.status}
              </p>

              <p className="text-sm text-gray-500">
                Priority: {task.priority}
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}