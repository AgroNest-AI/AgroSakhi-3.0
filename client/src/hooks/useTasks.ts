import { useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Task } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

export function useTasks(userId: number) {
  // Query for fetching tasks
  const { 
    data: tasks,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<Task[]>({
    queryKey: [`/api/tasks/${userId}`],
    enabled: !!userId,
  });

  // Mutation for creating a new task
  const createTaskMutation = useMutation({
    mutationFn: async (taskData: {
      userId: number;
      farmId?: number;
      cropId?: number;
      title: string;
      description?: string;
      scheduledDate?: Date;
      priority?: string;
    }) => {
      const response = await apiRequest("POST", "/api/tasks", taskData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/tasks/${userId}`] });
    },
  });

  // Mutation for updating task completion status
  const updateTaskCompletionMutation = useMutation({
    mutationFn: async ({ taskId, completed }: { taskId: number; completed: boolean }) => {
      const response = await apiRequest(
        "PATCH", 
        `/api/tasks/${taskId}/complete`,
        { completed }
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/tasks/${userId}`] });
    },
  });

  // Helper function to toggle task completion
  const toggleTaskCompletion = useCallback(
    (taskId: number, currentCompleted: boolean) => {
      updateTaskCompletionMutation.mutate({
        taskId,
        completed: !currentCompleted,
      });
    },
    [updateTaskCompletionMutation]
  );

  // Helper to create a new task
  const createTask = useCallback(
    (taskData: {
      userId: number;
      farmId?: number;
      cropId?: number;
      title: string;
      description?: string;
      scheduledDate?: Date;
      priority?: string;
    }) => {
      createTaskMutation.mutate(taskData);
    },
    [createTaskMutation]
  );

  // Get tasks for today
  const getTodaysTasks = useCallback(() => {
    if (!tasks) return [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return tasks.filter(task => {
      if (!task.scheduledDate) return false;
      
      const taskDate = new Date(task.scheduledDate);
      taskDate.setHours(0, 0, 0, 0);
      
      return taskDate.getTime() === today.getTime();
    });
  }, [tasks]);

  return {
    tasks,
    isLoading,
    isError,
    error,
    refetch,
    createTask,
    toggleTaskCompletion,
    getTodaysTasks,
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskCompletionMutation.isPending,
  };
}
