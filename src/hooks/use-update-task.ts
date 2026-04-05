import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Task } from "../../types";

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (task: Task) =>
      axios.put(`/api/tasks/${task.id}`, task),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};