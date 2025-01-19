import { Task } from '@/types';
import TaskCard from './TaskCard';

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDrop: (e: React.DragEvent) => void;
  onEditTask: (taskId: string, updatedTask: Partial<Task>) => void;
}

export default function KanbanColumn({ title, tasks, onDragStart, onDrop, onEditTask }: KanbanColumnProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className="flex-1 min-w-[300px] bg-gradient-to-b from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200 shadow-lg"
      onDrop={onDrop}
      onDragOver={handleDragOver}
    >
      <h2 className="text-xl font-bold mb-4 text-blue-800 px-2">{title}</h2>
      <div className="space-y-4">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onDragStart={onDragStart}
            onEditTask={onEditTask}
          />
        ))}
      </div>
    </div>
  );
}
