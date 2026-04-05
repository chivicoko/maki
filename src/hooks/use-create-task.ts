import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Task } from "../../types";

type TasksResponse = {
  tasks: Task[];
  total: number;
};

export const useTasks = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await axios.get<TasksResponse>("/api/tasks");
      return res.data.tasks;
    },
  });
};