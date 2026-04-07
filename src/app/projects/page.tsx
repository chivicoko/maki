"use client";

import { useState } from "react";
import KanbanBoard from "@/components/tasks/kanban-board";
import CreateTaskModal from "@/components/tasks/create-task-modal";
import { Button } from "@/components/ui/button";
import { EyeClosedIcon, EyeIcon, EyeOffIcon, Plus, PlusIcon } from "lucide-react";
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
import { useProjects } from "@/hooks/use-projects";
import { ButtonGroup } from "@/components/ui/button-group";
import ProjectModal from "@/components/tasks/project-modal";
import { Project } from "../../../types";

const page = () => {
  const [open, setOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project>();
  const { setProject } = useUIStore();
  const { data: projects = [] } = useProjects();
  // console.log("projects: ", projects);
    
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
          <ButtonGroup>
            <Select onValueChange={(value) => setProject(value)}>
              <SelectTrigger className="w-[180px] bg-muted text-grey-800">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>

                {projects.map((project) => (
                  <SelectItem
                    key={project.id}
                    value={project.id}
                    onSelect={(e) => {
                      if (e.defaultPrevented) return;
                      setProject(project.id);
                    }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            type="button"
                            onPointerDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();

                              setEditingProject(project);
                              setProjectModalOpen(true);
                            }}
                            className="py-0 border-0 bg-transparent hover:bg-transparent relative group size-6"
                          >
                            <EyeIcon className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out" />
                            <EyeClosedIcon className="absolute opacity-100 group-hover:opacity-0 transition-opacity duration-500 ease-in-out" />
                          </Button>
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>
                            View and edit <strong>{project.name}</strong>
                          </p>
                        </TooltipContent>
                      </Tooltip>

                      <span>{project.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingProject(undefined);
                    setProjectModalOpen(true);
                  }}
                >
                  <PlusIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to create a new project</p>
              </TooltipContent>
            </Tooltip>
          </ButtonGroup>

          <ProjectModal
            open={projectModalOpen}
            setOpen={setProjectModalOpen}
            setEditingProject={setEditingProject}
            project={editingProject}
          />

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