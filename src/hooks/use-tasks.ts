// // src/hooks/useTasks.ts
// // New implementation
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Task } from "../../types";

type TasksResponse = {
  tasks: Task[];
  total: number;
};

// export const useTasks = () => {
//   return useQuery({
//     queryKey: ["tasks"],
//     queryFn: async () => {
//       const res = await axios.get<TasksResponse>("/api/tasks");
//       return res.data.tasks;
//     },
//   });
// };

export function useTasks(projectId?: string) {
  return useQuery({
    queryKey: ["tasks", projectId],
    queryFn: async () => {
      const url = "/api/tasks";
      // const url = projectId && projectId !== "all"
      //   ? `/api/tasks?projectId=${projectId}`
      //   : "/api/tasks";

      const res = await axios.get(url);
      return res.data.tasks;
    },
  });
}