'use client';

import { useState } from 'react';
import KanbanColumn from './KanbanColumn';
import { Task } from '@/types';
import AddTaskDialog from './AddTaskDialog';

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Example Task', description: 'This is an example task', status: 'todo', priority: 'low', dueDate: '2025-01-17' },
  ]);
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = (e: React.DragEvent, status: 'todo' | 'in-progress' | 'pending' | 'done') => {
    const taskId = e.dataTransfer.getData('taskId');
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status } : task
    ));
  };

  const addTask = (title: string, description: string, dueDate?: string, priority?: Task['priority']) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      status: 'todo',
      dueDate,
      priority
    };
    setTasks([...tasks, newTask]);
  };

  const editTask = (taskId: string, updatedTask: Partial<Task>) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, ...updatedTask } : task
    ));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <button
          onClick={() => setIsAddTaskDialogOpen(true)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Task
        </button>
      </div>
      <div className="flex-1 flex gap-4 p-4">
        <KanbanColumn
          title="To Do"
          tasks={tasks.filter(task => task.status === 'todo')}
          onDragStart={handleDragStart}
          onDrop={(e) => handleDrop(e, 'todo')}
          onEditTask={editTask}
        />
        <KanbanColumn
          title="In Progress"
          tasks={tasks.filter(task => task.status === 'in-progress')}
          onDragStart={handleDragStart}
          onDrop={(e) => handleDrop(e, 'in-progress')}
          onEditTask={editTask}
        />
        <KanbanColumn
          title="Pending"
          tasks={tasks.filter(task => task.status === 'pending')}
          onDragStart={handleDragStart}
          onDrop={(e) => handleDrop(e, 'pending')}
          onEditTask={editTask}
        />
        <KanbanColumn
          title="Done"
          tasks={tasks.filter(task => task.status === 'done')}
          onDragStart={handleDragStart}
          onDrop={(e) => handleDrop(e, 'done')}
          onEditTask={editTask}
        />
      </div>
      <AddTaskDialog
        isOpen={isAddTaskDialogOpen}
        onClose={() => setIsAddTaskDialogOpen(false)}
        onAddTask={addTask}
      />
    </div>
  );
}
