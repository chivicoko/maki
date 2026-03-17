// src/components/tasks/CreateTaskModal.tsx

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema } from "@/lib/validators";
import { z } from "zod";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type FormData = z.infer<typeof taskSchema>;

export default function CreateTaskModal({ open, setOpen }: any) {
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      status: "todo",
      priority: "medium",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => axios.post("/api/tasks", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
          className="space-y-4"
        >
          <input {...form.register("title")} placeholder="Task title" />

          <button type="submit" className="btn-primary">
            Create
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}