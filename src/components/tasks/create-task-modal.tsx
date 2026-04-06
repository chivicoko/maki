"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema } from "@/lib/validators";
import { z } from "zod";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { XCircleIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type FormData = z.infer<typeof taskSchema>;

export default function CreateTaskModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
}) {
  const queryClient = useQueryClient();

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

  const labels = watch("labels") ?? [];
  const assignees = watch("assignees") ?? [];

  const addLabel = () => {
    const value = labelInput.trim();
    if (!value || labels.includes(value)) return;

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
    mutationFn: async (data: FormData) => {
      const res = await axios.post("/api/tasks", data);
      return res.data;
    },

    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previous = queryClient.getQueryData<any[]>(["tasks"]);

      queryClient.setQueryData<FormData[]>(["tasks"], (old = []) => [
        ...old,
        {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          ...newTask,
        },

        // {
        //   id: crypto.randomUUID(),
        //   createdAt: new Date().toISOString(),
        //   dueDate: newTask.dueDate || "",
        //   labels: newTask.labels || [],
        //   assignees: newTask.assignees || [],
        //   ...newTask,
        // },
      ]);

      return { previous };
    },

    onSuccess: () => {
      toast.success("Task created successfully ✅");
      setOpen(false);
      reset({
        title: "",
        status: "todo",
        priority: "medium",
        description: "",
        projectId: "",
        labels: [],
        assignees: [],
        dueDate: "",
      });
      setLabelInput("");
      setAssigneeInput("");
    },

    onError: (_err, _data, context) => {
      toast.error("Failed to create task ❌");

      if (context?.previous) {
        queryClient.setQueryData(["tasks"], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* TITLE */}
          <div className="space-y-1">
            <Label>Title</Label>
            <Input {...register("title")} placeholder="Task title" />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* LABELS */}
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
                <Badge key={idx} className="bg-gray-200 text-foreground pr-1 capitalize">
                  {label}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLabel(label)}
                    className="h-4 w-4 ml-1"
                  >
                    <XCircleIcon className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          {/* ASSIGNEES */}
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
                <Badge key={idx} className="bg-gray-200 text-foreground pr-1 capitalize">
                  {assignee.name}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAssignee(assignee.name)}
                    className="h-4 w-4 ml-1"
                  >
                    <XCircleIcon className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 flex-wrap">
            {/* DUE DATE */}
            <div className="space-y-1">
              <Label>Due Date</Label>
              <Input type="date" {...register("dueDate")} />
              {errors.dueDate && (
                <p className="text-sm text-red-500">
                  {errors.dueDate.message}
                </p>
              )}
            </div>

            {/* PROJECT */}
            <div className="space-y-1">
              <Label>Project ID</Label>
              <Input {...register("projectId")} placeholder="project-alpha" />
              {errors.projectId && (
                <p className="text-sm text-red-500">
                  {errors.projectId.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 flex-wrap">
            {/* STATUS */}
            <div className="space-y-1">
              <Label>Status</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
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
            <div className="space-y-1">
              <Label>Priority</Label>
              <Controller
                control={control}
                name="priority"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
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
            <Textarea
              {...register("description")}
              placeholder="Task description"
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending || !isDirty}
          >
            {mutation.isPending ? "Creating..." : "Create Task"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}