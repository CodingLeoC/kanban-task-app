import { Task } from '@/types';

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
}

export default function TaskCard({ task, onDragStart }: TaskCardProps) {
  const backgroundColors = {
    'todo': 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-200',
    'in-progress': 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:from-amber-100 hover:to-amber-200',
    'pending': 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:from-purple-100 hover:to-purple-200',
    'done': 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:from-emerald-100 hover:to-emerald-200'
  }[task.status];

  const textColors = {
    'todo': 'text-blue-800',
    'in-progress': 'text-amber-800',
    'pending': 'text-purple-800',
    'done': 'text-emerald-800'
  }[task.status];

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
    <div
      className={`p-4 rounded-lg shadow-sm border-2 cursor-move transform transition-all duration-200 hover:shadow-md hover:-translate-y-1 ${backgroundColors}`}
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
    >
      <h3 className={`font-bold mb-2 ${textColors}`}>{task.title}</h3>
      <p className="text-gray-700 text-sm">{task.description}</p>
      {task.dueDate && (
        <div className="mt-2 text-sm flex items-center gap-1">
          <svg className={`w-4 h-4 ${getDueDateUrgency(task.dueDate) === 'normal' ? 'text-gray-500' : 'text-amber-500'}`} 
               fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          <span className={getDueDateStyles(task.dueDate)}>
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </span>
        </div>
      )}
    </div>
  );
}
