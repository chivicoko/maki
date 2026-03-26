"use client";

import { useTasks } from "@/hooks/use-tasks";
import { useTaskStore } from "@/store/task-store";
import { Task } from "../../../types";
import { useEffect } from "react";
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

type FormData = z.infer<typeof taskSchema>;

export default function TaskDrawer() {
    const { selectedTaskId, setTask } = useTaskStore();
    const { data: tasks = [] } = useTasks();
    const queryClient = useQueryClient();

    const task = tasks.find((t: Task) => t.id === selectedTaskId);

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<FormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
        title: "",
        status: "todo",
        priority: "medium",
        description: "",
        },
    });

    // Sync selected task into form
    useEffect(() => {
        if (task) {
        reset(task);
        }
    }, [task, reset]);

    const mutation = useMutation({
        mutationFn: async (updated: FormData & { id: string }) => {
            const res = await axios.put(`/api/tasks/${updated.id}`, updated);
            console.log("res.data: ", res.data);
            return res.data;
        },

        onMutate: async (updatedTask) => {
            await queryClient.cancelQueries({ queryKey: ["tasks"] });

            const previous = queryClient.getQueryData<Task[]>(["tasks"]);
            console.log("previous: ", previous);
            console.log("updatedTask: ", updatedTask);

            queryClient.setQueryData<Task[]>(["tasks"], (old = []) =>
                old.map((t) =>
                    t.id === updatedTask.id ? { ...t, ...updatedTask } : t
                )
            );

            return { previous };
        },

        onSuccess: (serverTask) => {
            toast.success("Task updated successfully ✅");
            console.log("SERVER RESPONSE:", serverTask);

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

  return (
    <Sheet open={!!selectedTaskId} onOpenChange={() => setTask(null)}>
      <SheetContent side="right" className="w-[400px]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 px-4"
        >
          <SheetHeader>
            <SheetTitle className="text-xl font-semibold">
              {task?.title}
            </SheetTitle>
          </SheetHeader>

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

          {/* STATUS */}
          <div className="space-y-1">
            <Label>Status</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
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
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
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
            {mutation.isPending ? "Saving..." : "Save Changes"}
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
        </form>
      </SheetContent>
    </Sheet>
  );
}