import { Task } from '@/types';

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
}

export default function TaskCard({ task, onDragStart }: TaskCardProps) {
  const statusColors = {
    'todo': 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:from-purple-100 hover:to-purple-200',
    'in-progress': 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:from-amber-100 hover:to-amber-200',
    'done': 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:from-emerald-100 hover:to-emerald-200'
  }[task.status];

  const statusTextColors = {
    'todo': 'text-purple-800',
    'in-progress': 'text-amber-800',
    'done': 'text-emerald-800'
  }[task.status];

  return (
    <div
      className={`p-4 rounded-lg shadow-sm border-2 cursor-move transform transition-all duration-200 hover:shadow-md hover:-translate-y-1 ${statusColors}`}
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
    >
      <h3 className={`font-bold mb-2 ${statusTextColors}`}>{task.title}</h3>
      <p className="text-gray-700 text-sm">{task.description}</p>
    </div>
  );
}
