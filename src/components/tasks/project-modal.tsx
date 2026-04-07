"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2Icon, XCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { Project } from "../../../types";
import { Spinner } from "../ui/spinner";

type Member = {
  name: string;
  avatar?: string;
};

type FormValues = {
  name: string;
  description: string;
  color?: string;
};

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
  setEditingProject: (project: Project | undefined) => void;
  project?: any;
};

export default function ProjectModal({
  open,
  setOpen,
  setEditingProject,
  project,
}: Props) {
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, setValue, watch } =
    useForm<FormValues>({
      defaultValues: {
        name: "",
        description: "",
        color: "#3b82f6",
      },
    });

  const [memberInput, setMemberInput] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const selectedColor = watch("color");
  // console.log("project: ", project);

  useEffect(() => {
    if (project) {
      reset({
        name: project.name,
        description: project.description,
        color: project.color || "#3b82f6",
      });

      setMembers(project.members || []);
    } else {
      reset({
        name: "",
        description: "",
        color: "#3b82f6",
      });

      setMembers([]);
    }
  }, [project, reset]);

    // console.log("members: ", members);

  const addMember = () => {
    const value = memberInput.trim();
    if (!value) return;

    const exists = members.some(
      (m) => m.name.toLowerCase() === value.toLowerCase()
    );

    if (exists) return;

    setMembers([...members, { name: value }]);
    setMemberInput("");
  };

  const removeMember = (name: string) => {
    setMembers(members.filter((m) => m.name !== name));
  };

  // Create Mutation
  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const payload = {
        ...data,
        members,
      };

      if (project) {
        const res = await axios.put(
          `/api/projects/${project.id}`,
          payload
        );
        return res.data.project;
      }

      const res = await axios.post("/api/projects", payload);
      return res.data.project;
    },

    onSuccess: () => {
      toast.success(
        project
          ? "Project updated successfully"
          : "Project created successfully"
      );

      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      setOpen(false);
    },

    onError: () => {
      toast.error("Something went wrong");
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
        if (!project) return;
        return axios.delete(`/api/projects/${project.id}`);
    },

    onSuccess: (res) => {
        toast.success(res?.data.message);

        queryClient.invalidateQueries({
        queryKey: ["projects"],
        });

        queryClient.invalidateQueries({
        queryKey: ["tasks"],
        });

        setOpen(false);
        setOpenDeleteModal(false);
    },

    onError: () => {
        toast.error("Failed to delete project");
    },
  });

  return (
    <>
        {/* MAIN CREATE/EDIT MODAL */}
        <Dialog
            open={open}
            onOpenChange={(val) => {
                setOpen(val);

                if (!val) {
                setEditingProject?.(undefined);
                }
            }}
        >
        <DialogContent className="space-y-4">
            <DialogHeader>
            <DialogTitle>
                {project ? "Edit Project" : "Create Project"}
            </DialogTitle>
            </DialogHeader>

            <form
            onSubmit={handleSubmit((data) =>
                mutation.mutate(data)
            )}
            className="space-y-4"
            >
            {/* PROJECT NAME */}
            <Input
                {...register("name")}
                placeholder="Project name"
            />

            {/* DESCRIPTION */}
            <Input
                {...register("description")}
                placeholder="Description"
            />

            {/* COLOR */}
            <div className="space-y-2">
                <p className="text-sm font-medium">Project Color</p>

                <div className="flex items-center gap-3">
                <Input
                    type="color"
                    value={selectedColor}
                    onChange={(e) =>
                    setValue("color", e.target.value)
                    }
                    className="w-14 h-10 p-1"
                />

                <Input
                    {...register("color")}
                    placeholder="#3b82f6"
                />
                </div>
            </div>

            {/* MEMBERS */}
            <div className="space-y-2">
                <p className="text-sm font-medium">Members</p>

                <Input
                value={memberInput}
                onChange={(e) =>
                    setMemberInput(e.target.value)
                }
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    addMember();
                    }
                }}
                placeholder="Type member and press Enter"
                />

                <div className="flex flex-wrap gap-2">
                {members.map((member, idx) => (
                    <Badge
                    key={idx}
                    className="bg-muted text-foreground"
                    >
                    {member.name}
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1"
                        onClick={() =>
                        removeMember(member.name)
                        }
                    >
                        <XCircleIcon className="w-3 h-3" />
                    </Button>
                    </Badge>
                ))}
                </div>
            </div>

            <div className="space-y-2">
                <Button
                    type="submit"
                    className="w-full"
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ?
                        <div className="flex items-center gap-2">
                            <Spinner />
                            {project ? "Updating" : "Creating"}
                        </div>
                    : project
                        ? "Update Project"
                        : "Create Project"
                    }
                </Button>
        
                {project && (
                    <Button
                        type="button"
                        variant="destructive"
                        className="w-full"
                        onClick={() => setOpenDeleteModal(true)}
                    >
                        Delete Project
                    </Button>
                )}
            </div>
            </form>
        </DialogContent>
        </Dialog>
        
        {/* DELETE CONFIRMATION MODAL */}
        <Dialog
            open={openDeleteModal}
            onOpenChange={setOpenDeleteModal}
            >
            <DialogContent>
                <DialogHeader>
                <DialogTitle>
                    <strong>{project?.name}</strong>
                </DialogTitle>

                <DialogDescription className="flex flex-col items-center gap-2 mt-5">
                    <Trash2Icon className="text-red-600" />

                    <span className="mt-2 text-center text-foreground">
                    Are you sure you want to delete this project?
                    </span>

                    <span className="text-center text-sm text-muted-foreground">
                    All tasks associated with this project will also be deleted.
                    </span>

                    <i className="font-semibold text-foreground">
                    This action cannot be undone.
                    </i>
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
                    onClick={() => deleteMutation.mutate()}
                    disabled={deleteMutation.isPending}
                >
                    {deleteMutation.isPending
                        ? 
                        <div className="flex items-center gap-2">
                            <Spinner />
                            <p>Deleting</p>
                        </div>
                        : "Delete Project"
                    }
                </Button>
                </div>
            </DialogContent>
        </Dialog>
    </>
  );
}