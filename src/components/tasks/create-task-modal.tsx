"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema } from "@/lib/validators";
import { z } from "zod";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type FormData = z.infer<typeof taskSchema>;

export default function CreateTaskModal({ open, setOpen }: { open: boolean; setOpen: (val: boolean) => void }) {
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      status: "todo",
      priority: "medium",
      description: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      axios.post("/api/tasks", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setOpen(false);
      form.reset();
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
          className="space-y-4"
        >
          {/* TITLE */}
          <div>
            <Label>Title</Label>
            <Input {...form.register("title")} placeholder="Task title" />
          </div>

          {/* STATUS */}
          <div>
            <Label>Status</Label>
            <Select {...form.register("status")}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">Todo</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* PRIORITY */}
          <div>
            <Label>Priority</Label>
            <Select {...form.register("priority")}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* DESCRIPTION */}
          <div>
            <Label>Description</Label>
            <Textarea {...form.register("description")} placeholder="Task description" />
          </div>

          <Button type="submit" className="w-full">
            Create Task
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}