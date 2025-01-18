import { Task } from '@/types';
import TaskCard from './TaskCard';

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDrop: (e: React.DragEvent) => void;
}

export default function KanbanColumn({ title, tasks, onDragStart, onDrop }: KanbanColumnProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className="flex-1 min-w-[300px] bg-gray-100 rounded-lg p-4"
      onDrop={onDrop}
      onDragOver={handleDragOver}
    >
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="space-y-3">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onDragStart={onDragStart}
          />
        ))}
      </div>
    </div>
  );
}
