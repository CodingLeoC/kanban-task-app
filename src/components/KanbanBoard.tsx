'use client';

import { useState } from 'react';
import KanbanColumn from './KanbanColumn';
import { Task } from '@/types';

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Example Task', description: 'This is an example task', status: 'todo' },
  ]);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = (e: React.DragEvent, status: 'todo' | 'in-progress' | 'done') => {
    const taskId = e.dataTransfer.getData('taskId');
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status } : task
    ));
  };

  const addTask = (title: string, description: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      status: 'todo'
    };
    setTasks([...tasks, newTask]);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex gap-4 p-4">
        <KanbanColumn
          title="To Do"
          tasks={tasks.filter(task => task.status === 'todo')}
          onDragStart={handleDragStart}
          onDrop={(e) => handleDrop(e, 'todo')}
        />
        <KanbanColumn
          title="In Progress"
          tasks={tasks.filter(task => task.status === 'in-progress')}
          onDragStart={handleDragStart}
          onDrop={(e) => handleDrop(e, 'in-progress')}
        />
        <KanbanColumn
          title="Done"
          tasks={tasks.filter(task => task.status === 'done')}
          onDragStart={handleDragStart}
          onDrop={(e) => handleDrop(e, 'done')}
        />
      </div>
    </div>
  );
}
