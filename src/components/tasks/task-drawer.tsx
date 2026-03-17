"use client";

import { useTasks } from "@/hooks/use-tasks";
import { useTaskStore } from "@/store/task-store";
import { Task } from "../../../types";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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

export default function TaskDrawer() {
  const { selectedTaskId, setTask } = useTaskStore();
  const { data: tasks = [] } = useTasks();
  const queryClient = useQueryClient();

  const task = tasks.find((t: Task) => t.id === selectedTaskId);

  const [form, setForm] = useState<Task | null>(null);

  useEffect(() => {
    if (task) setForm(task);
  }, [task]);

  const mutation = useMutation({
    mutationFn: (updated: Task) => axios.put(`/api/tasks/${updated.id}`, updated),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleSave = () => {
    if (form) mutation.mutate(form);
  };

  return (
    <Sheet open={!!selectedTaskId} onOpenChange={() => setTask(null)}>
      <SheetContent side="right" className="w-[400px]">
        {form && (
          <>
            <SheetHeader>
              <SheetTitle className="font-semibold capitalize text-xl">{form.title}</SheetTitle>
            </SheetHeader>

            <hr className="" />

            <div className="px-4 space-y-4">
                {/* TITLE */}
                <div>
                    <Label>Title</Label>
                    <Input
                    value={form.title}
                    onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                    }
                    />
                </div>
                
              {/* STATUS */}
              <div>
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(value) =>
                    setForm({ ...form, status: value as Task["status"] })
                  }
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
              </div>

              {/* PRIORITY */}
              <div>
                <Label>Priority</Label>
                <Select
                  value={form.priority}
                  onValueChange={(value) =>
                    setForm({ ...form, priority: value as Task["priority"] })
                  }
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
              </div>

              {/* DESCRIPTION */}
              <div>
                <Label>Description</Label>
                <Textarea
                  value={form.description || ""}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>

                {/* SAVE */}
                <Button
                    onClick={() => form && mutation.mutate(form)}
                    disabled={mutation.isPending}
                    className="w-full"
                >
                    {mutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
                
                {/* ✅ ACTIVITY PLACEHOLDER */}
                <div className="pt-4">
                    {activities.length > 0 
                    ? <ActivityFeed />
                    : <p className="text-xs text-gray-400">No activity yet...</p>
                    }
                </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}