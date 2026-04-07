"use client";

import { useTasks } from "@/hooks/use-tasks";
import { useTaskStore } from "@/store/task-store";
import { Task } from "../../../types";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { activities } from "@/lib/data";
import ActivityFeed from "../dashboard/activity-feed";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema } from "@/lib/validators";
import { z } from "zod";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Trash2Icon, XCircleIcon, XIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Spinner } from "../ui/spinner";

type FormData = z.infer<typeof taskSchema>;

export default function TaskDrawer() {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { selectedTaskId, setTask } = useTaskStore();
  const { data: tasks = [] } = useTasks();
  const queryClient = useQueryClient();

  const task = tasks.find((t: Task) => t.id === selectedTaskId);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      status: "todo",
      priority: "medium",
      description: "",
      projectId: "",
      labels: [],
      assignees: [],
      dueDate: "",
    },
  });

  const [labelInput, setLabelInput] = useState("");
  const [assigneeInput, setAssigneeInput] = useState("");

  const labels = watch("labels");
  const assignees = watch("assignees");

  // Sync selected task into form
  useEffect(() => {
    if (!task) return;

    reset({
      ...task,
      labels: task.labels ?? [],
      assignees: task.assignees ?? [],
    });
  }, [task, reset]);

  const addLabel = () => {
    const value = labelInput.trim();
    if (!value) return;
    if (labels.includes(value)) return;

    setValue("labels", [...labels, value], {
      shouldDirty: true,
    });

    setLabelInput("");
  };

  const removeLabel = (label: string) => {
    setValue(
      "labels",
      labels.filter((l) => l !== label),
      { shouldDirty: true }
    );
  };

  const addAssignee = () => {
    const value = assigneeInput.trim();
    if (!value) return;

    const exists = assignees.some(
      (a) => a.name.toLowerCase() === value.toLowerCase()
    );

    if (exists) return;

    setValue(
      "assignees",
      [...assignees, { name: value }],
      { shouldDirty: true }
    );

    setAssigneeInput("");
  };

  const removeAssignee = (name: string) => {
    setValue(
      "assignees",
      assignees.filter((a) => a.name !== name),
      { shouldDirty: true }
    );
  };

  const mutation = useMutation({
      mutationFn: async (updated: FormData & { id: string }) => {
          const res = await axios.put(`/api/tasks/${updated.id}`, updated);
          return res.data;
      },

      onMutate: async (updatedTask) => {
          await queryClient.cancelQueries({ queryKey: ["tasks"] });

          const previous = queryClient.getQueryData<Task[]>(["tasks"]);

          queryClient.setQueryData<Task[]>(["tasks"], (old = []) =>
              old.map((t) =>
                  t.id === updatedTask.id ? { ...t, ...updatedTask } : t
              )
          );

          return { previous };
      },

      onSuccess: (serverTask) => {
          toast.success("Task updated successfully ✅");

          queryClient.setQueryData<Task[]>(["tasks"], (old = []) =>
              old.map((t) =>
                  t.id === serverTask.id ? serverTask : t
              )
          );
      },

      onError: (_err, _data, context) => {
          toast.error("Failed to update task ❌");

          if (context?.previous) {
              queryClient.setQueryData(["tasks"], context.previous);
          }
      },

      onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ["tasks"] }); 
      },
  });

  const onSubmit = (data: FormData) => {
    if (!task) return;

    if (!isDirty) {
      toast("No changes to save");
      return;
    }

    mutation.mutate({ ...data, id: task.id });
  };

  const deleteMutation = useMutation({
    mutationFn: async (taskId: string) => {
      await axios.delete(`/api/tasks/${taskId}`);
      return taskId;
    },

    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previous = queryClient.getQueryData<Task[]>(["tasks"]);

      queryClient.setQueryData<Task[]>(["tasks"], (old = []) =>
        old.filter((t) => t.id !== taskId)
      );

      return { previous };
    },

    onSuccess: () => {
      toast.success("Task deleted successfully 🗑️");
      setOpenDeleteModal(false);
      setTask(null); // closes drawer
    },

    onError: (_err, _taskId, context) => {
      toast.error("Failed to delete task ❌");

      if (context?.previous) {
        queryClient.setQueryData(["tasks"], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return (
    <>
      <Sheet open={!!selectedTaskId} onOpenChange={() => setTask(null)}>
        <SheetContent side="right" className="w-[400px] overflow-y-scroll custom-scrollbar">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <SheetHeader>
              <SheetTitle className="text-xl font-semibold">
                {task?.title}
              </SheetTitle>
            </SheetHeader>

            <hr/>

            <div className="px-4 pb-4 space-y-4">
              {/* TITLE */}
              <div className="space-y-1">
                <Label>Title</Label>
                <Input {...register("title")} />
                {errors.title && (
                  <p className="text-sm text-red-500">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Labels</Label>

                <Input
                  value={labelInput}
                  onChange={(e) => setLabelInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      addLabel();
                    }
                  }}
                  placeholder="Type label and press Enter"
                />
                {errors.labels && (
                  <p className="text-sm text-red-500">
                    {errors.labels.message}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {labels.map((label, idx) => (
                    <Badge
                      key={idx}
                      className="bg-gray-200 text-foreground capitalize pr-0.5"
                    >
                      <span>{label}</span>
                      <Button
                        onClick={() => removeLabel(label)}
                        className="cursor-pointer p-0 bg-transparent text-destructive"
                      >
                        <XCircleIcon />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>


              <div className="space-y-2">
                <Label>Assignees</Label>

                <Input
                  value={assigneeInput}
                  onChange={(e) => setAssigneeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      addAssignee();
                    }
                  }}
                  placeholder="Type assignee and press Enter"
                />
                {errors.assignees && (
                  <p className="text-sm text-red-500">
                    {errors.assignees.message}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {assignees.map((assignee, idx) => (
                    <Badge
                      key={idx}
                      className="bg-gray-200 text-foreground capitalize px-1 gap-2"
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Avatar className="size-5">
                            {assignee.avatar ? (
                              <AvatarImage
                                src={assignee.avatar}
                                alt={assignee.name}
                              />
                            ) : null}

                            <AvatarFallback className="text-[10px]">
                              {getInitials(assignee.name)}
                            </AvatarFallback>
                          </Avatar>
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>{assignee.name}</p>
                        </TooltipContent>
                      </Tooltip>

                      <span>{assignee.name}</span>

                      <Button
                        type="button"
                        onClick={() => removeAssignee(assignee.name)}
                        className="cursor-pointer p-0 bg-transparent text-destructive h-auto"
                      >
                        <XCircleIcon className="w-4 h-4" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <Label>Due Date</Label>
                <Input type="date" {...register("dueDate")} />
                {errors.dueDate && (
                  <p className="text-sm text-red-500">
                    {errors.dueDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label>Project ID</Label>
                <Input {...register("projectId")} />
                {errors.projectId && (
                  <p className="text-sm text-red-500">
                    {errors.projectId.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between gap-2">
                {/* STATUS */}
                <div className="flex-1/2 space-y-1">
                  <Label>Status</Label>
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todo">Todo</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="done">Done</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.status && (
                    <p className="text-sm text-red-500">
                      {errors.status.message}
                    </p>
                  )}
                </div>

                {/* PRIORITY */}
                <div className="flex-1/2 space-y-1">
                  <Label>Priority</Label>
                  <Controller
                    control={control}
                    name="priority"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.priority && (
                    <p className="text-sm text-red-500">
                      {errors.priority.message}
                    </p>
                  )}
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-1">
                <Label>Description</Label>
                <Textarea {...register("description")} />
                {errors.description && (
                  <p className="text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* SAVE */}
              <Button
                type="submit"
                className="w-full"
                disabled={mutation.isPending || !isDirty}
              >
                {mutation.isPending ? 
                <div className="flex items-center gap-2">
                  <Spinner />
                  <p>Saving</p>
                </div>
                : "Save Changes"}
              </Button>

              {/* DELETE */}
              <Button
                type="button"
                variant={"destructive"}
                onClick={() => setOpenDeleteModal(true)}
                className="w-full"
              >
                Delete Task
              </Button>

              {/* ACTIVITY */}
              <div className="pt-4">
                {activities.length > 0 ? (
                  <ActivityFeed />
                ) : (
                  <p className="text-xs text-gray-400">
                    No activity yet...
                  </p>
                )}
              </div>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      {/* DELETE MODAL */}
      <Dialog
        open={openDeleteModal}
        onOpenChange={setOpenDeleteModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <strong>{task?.title}</strong>
            </DialogTitle>
            <DialogDescription className="flex flex-col items-center gap-2 mt-5">
              <Trash2Icon className="text-red-600" />
              <span className="mt-2 text-center text-foreground">Are you sure you want to delete this task?</span>
              <i className="font-semibold text-foreground">This action cannot be undone.</i>
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpenDeleteModal(false)}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={() => task && deleteMutation.mutate(task.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending
                ? 
                <div className="flex items-center gap-2">
                    <Spinner />
                    <p>Deleting</p>
                </div>
                : "Delete Task"
              }
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}