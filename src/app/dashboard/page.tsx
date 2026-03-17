"use client";

import { useState } from "react";
import KanbanBoard from "@/components/tasks/kanban-board";
import CreateTaskModal from "@/components/tasks/create-task-modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Stats from "@/components/tasks/stats";
import TaskDrawer from "@/components/tasks/task-drawer";
import { useUIStore } from "@/store/ui-store";

export default function DashboardPage() {
  const [open, setOpen] = useState(false);
  const { setProject } = useUIStore();

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-muted-foreground text-sm">
            Manage your team tasks efficiently
          </p>
        </div>



        {/* MODAL TRIGGER BUTTON */}
        <div className="flex items-center gap-4">
          <select
            onChange={(e) => setProject(e.target.value)}
            className="border rounded-md px-2 py-1"
          >
            <option value="all">All Projects</option>
            <option value="p1">Dashboard App</option>
          </select>

          <Button onClick={() => setOpen(true)} className="flex items-center gap-2">
            <Plus className="size-4" />
            New Task
          </Button>
        </div>
      </div>

      {/* STATS */}
      <Stats />

      {/* KANBAN BOARD */}
      <KanbanBoard />

      {/* MODAL */}
      <CreateTaskModal open={open} setOpen={setOpen} />

      {/* TASK DRAWER */}
      <TaskDrawer />
    </div>
  );
}