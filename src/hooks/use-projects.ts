// hooks/use-projects.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Project } from "../../types";

export function useProjects() {
  return useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await axios.get("/api/projects");
      return res.data.projects;
    },
  });
}