import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Task } from "@shared/schema";
import { useTasks } from "@/hooks/useTasks";

interface TaskCardProps {
  tasks: Task[];
  isLoading?: boolean;
  onAddTaskClick?: () => void;
  userId: number;
}

export default function TaskCard({ 
  tasks, 
  isLoading = false,
  onAddTaskClick,
  userId
}: TaskCardProps) {
  const { t } = useTranslation();
  const { toggleTaskCompletion, isUpdating } = useTasks(userId);
  
  // Format date for display
  const formatTaskDate = (date: Date | string | null): string => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // If loading state
  if (isLoading) {
    return (
      <Card className="bg-white rounded-lg shadow-md mb-4">
        <CardContent className="p-4">
          <div className="h-6 bg-neutral-200 rounded w-1/3 mb-4 animate-pulse"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex animate-pulse">
                <div className="w-6 h-6 rounded-full bg-neutral-200 mr-3"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-neutral-200 rounded"></div>
                  <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="h-10 bg-neutral-200 rounded-lg w-full mt-4 animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-lg shadow-md mb-4">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-3">{t('tasks_title')}</h2>
        
        {tasks.length === 0 ? (
          <p className="text-neutral-600 text-sm">{t('No tasks for today')}</p>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li key={task.id} className="flex items-center">
                <div 
                  className={`w-6 h-6 rounded-full border-2 border-primary-500 flex items-center justify-center mr-3 cursor-pointer ${
                    isUpdating ? 'opacity-50' : ''
                  }`}
                  onClick={() => !isUpdating && toggleTaskCompletion(task.id, task.completed)}
                >
                  {task.completed && (
                    <span className="material-icons text-sm text-primary-500">check</span>
                  )}
                </div>
                <div className={`flex-1 ${task.completed ? 'text-neutral-400' : ''}`}>
                  <p className={`font-medium ${task.completed ? 'line-through' : ''}`}>
                    {task.title}
                  </p>
                  <p className="text-sm text-neutral-600">
                    {task.farmId ? `Field #${task.farmId}` : ''} 
                    {task.scheduledDate && ` - Scheduled: ${formatTaskDate(task.scheduledDate)}`}
                  </p>
                </div>
                <span className="material-icons text-neutral-400">chevron_right</span>
              </li>
            ))}
          </ul>
        )}
        
        <button 
          className="w-full mt-4 py-2 border border-primary-500 text-primary-500 rounded-lg flex items-center justify-center"
          onClick={onAddTaskClick}
        >
          <span className="material-icons text-sm mr-1">add</span>
          {t('add_task')}
        </button>
      </CardContent>
    </Card>
  );
}
