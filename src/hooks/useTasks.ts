// src/hooks/useTasks.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useTasks = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await axios.get("/api/tasks");
      return res.data;
    },
  });
};