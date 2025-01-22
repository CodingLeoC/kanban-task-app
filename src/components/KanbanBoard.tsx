'use client';

import { useEffect, useState } from 'react';
import KanbanColumn from './KanbanColumn';
import { Task } from '@/types';
import AddTaskDialog from './AddTaskDialog';
import { tasksService } from '@/services/tasks';

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const loadedTasks = await tasksService.getAllTasks();
      setTasks(loadedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = async (e: React.DragEvent, status: 'todo' | 'in-progress' | 'pending' | 'done') => {
    const taskId = e.dataTransfer.getData('taskId');
    try {
      await tasksService.updateTask(taskId, { status });
      setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status } : task)));
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const addTask = async (
    title: string,
    description: string,
    dueDate?: string,
    priority?: Task['priority']
  ) => {
    try {
      const newTask = await tasksService.createTask({
        title,
        description,
        status: 'todo',
        dueDate,
        priority,
      });
      setTasks([...tasks, newTask]);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const editTask = async (taskId: string, updatedTask: Partial<Task>) => {
    try {
      await tasksService.updateTask(taskId, updatedTask);
      setTasks(tasks.map((task) => (task.id === taskId ? { ...task, ...updatedTask } : task)));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
          tasks={tasks.filter((task) => task.status === 'todo')}
          onDragStart={handleDragStart}
          onDrop={(e) => handleDrop(e, 'todo')}
          onEditTask={editTask}
        />
        <KanbanColumn
          title="In Progress"
          tasks={tasks.filter((task) => task.status === 'in-progress')}
          onDragStart={handleDragStart}
          onDrop={(e) => handleDrop(e, 'in-progress')}
          onEditTask={editTask}
        />
        <KanbanColumn
          title="Pending"
          tasks={tasks.filter((task) => task.status === 'pending')}
          onDragStart={handleDragStart}
          onDrop={(e) => handleDrop(e, 'pending')}
          onEditTask={editTask}
        />
        <KanbanColumn
          title="Done"
          tasks={tasks.filter((task) => task.status === 'done')}
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
