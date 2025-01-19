import { Task } from '@/types';
import { useState } from 'react';
import TaskDialog from './TaskDialog';

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onEditTask: (taskId: string, updatedTask: Partial<Task>) => void;
}

export default function TaskCard({ task, onDragStart, onEditTask }: TaskCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const backgroundColors = task.status === 'done' 
    ? 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 hover:from-gray-100 hover:to-gray-200'
    : {
      'high': 'bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:from-red-100 hover:to-red-200',
      'medium': 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:from-amber-100 hover:to-amber-200',
      'low': 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:from-emerald-100 hover:to-emerald-200'
    }[task.priority || 'low'];

  const textColors = task.status === 'done'
    ? 'text-gray-600'
    : {
      'high': 'text-red-800',
      'medium': 'text-amber-800',
      'low': 'text-emerald-800'
    }[task.priority || 'low'];

  const getDueDateUrgency = (dueDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'overdue';
    if (diffDays < 3) return 'urgent';
    return 'normal';
  };

  const getDueDateStyles = (dueDate: string) => {
    const urgency = getDueDateUrgency(dueDate);
    switch (urgency) {
      case 'overdue':
        return 'bg-red-100 text-red-800 border border-red-200 rounded px-2 py-0.5';
      case 'urgent':
        return 'bg-amber-100 text-amber-800 border border-amber-200 rounded px-2 py-0.5';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <>
      <div
        className={`p-4 rounded-lg shadow-sm border-2 cursor-pointer transform transition-all duration-200 hover:shadow-md hover:-translate-y-1 ${backgroundColors}`}
        draggable
        onDragStart={(e) => onDragStart(e, task.id)}
        onClick={() => setIsDialogOpen(true)}
      >
        <h3 className={`font-bold mb-2 ${textColors}`}>{task.title}</h3>
        <p className="text-gray-700 text-sm">{task.description}</p>
        {task.dueDate && (
          <div className="mt-2 text-sm flex items-center gap-1">
            <svg className={`w-4 h-4 ${getDueDateUrgency(task.dueDate) === 'normal' ? 'text-gray-500' : 'text-amber-500'}`} 
                 fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0121 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            <span className={getDueDateStyles(task.dueDate)}>
              Due: {new Date(task.dueDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
            </span>
          </div>
        )}
      </div>
      <TaskDialog
        task={task}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onEditTask={onEditTask}
      />
    </>
  );
}
