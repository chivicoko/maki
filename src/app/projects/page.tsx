"use client";

import { useState } from "react";
import KanbanBoard from "@/components/tasks/kanban-board";
import CreateTaskModal from "@/components/tasks/create-task-modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Stats from "@/components/tasks/stats";
import TaskDrawer from "@/components/tasks/task-drawer";
import { useUIStore } from "@/store/ui-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const page = () => {
  const [open, setOpen] = useState(false);
  const { setProject } = useUIStore();
    
  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] sm:text-[25px] md:text-[30px] font-semibold">Tasks</h2>
          <p className="text-muted-foreground text-sm">
            Manage your team tasks efficiently
          </p>
        </div>

        {/* MODAL TRIGGER BUTTON */}
        <div className="flex items-center gap-4">
          <Select onValueChange={(value) => setProject(value)}>
            <SelectTrigger className="w-[180px] bg-muted text-grey-800 border-2 border-gray-500">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="p1">Dashboard App</SelectItem>
            </SelectContent>
          </Select>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={() => setOpen(true)} className="flex items-center gap-2">
                <Plus className="size-4" />
                New Task
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to create a new task</p>
            </TooltipContent>
          </Tooltip>
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

export default page