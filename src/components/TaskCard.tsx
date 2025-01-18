import { Task } from '@/types';

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
}

export default function TaskCard({ task, onDragStart }: TaskCardProps) {
  return (
    <div
      className="bg-white p-4 rounded-lg shadow cursor-move"
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
    >
      <h3 className="font-medium mb-2">{task.title}</h3>
      <p className="text-gray-600 text-sm">{task.description}</p>
    </div>
  );
}
