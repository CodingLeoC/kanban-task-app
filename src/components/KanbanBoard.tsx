'use client';

import { useState, useEffect } from 'react';
import KanbanColumn from './KanbanColumn';
import { Comment, Task } from '@/types';
import AddTaskDialog from './AddTaskDialog';
import { getTasks, addTask as addTaskToDb, updateTask as updateTaskInDb, deleteTask as deleteTaskFromDb } from '@/firebase/taskService';
import { addComment as addCommentToDb } from '@/firebase/taskService';

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const fetchedTasks = await getTasks();
        setTasks(fetchedTasks as Task[]);
      } catch (error) {
        console.error('Error loading tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = async (e: React.DragEvent, status: Task['status']) => {
    const taskId = e.dataTransfer.getData('taskId');
    try {
      await updateTaskInDb(taskId, { status });
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
      const docRef = await addTaskToDb({
        title,
        description,
        status: 'todo',
        dueDate,
        priority,
        comments: [],
      });

      const newTask: Task = {
        id: docRef.id,
        title,
        description,
        status: 'todo',
        dueDate,
        priority,
        comments: [],
      };

      setTasks([...tasks, newTask]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const editTask = async (taskId: string, updatedTask: Partial<Task>) => {
    try {
      await updateTaskInDb(taskId, updatedTask);
      setTasks(tasks.map((task) => (task.id === taskId ? { ...task, ...updatedTask } : task)));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const addComment = async (taskId: string, content: string) => {
    try {
      const newComment = {
        taskId,
        content,
        author: 'User', // You might want to get this from auth context
        createdAt: new Date(),
      };

      // Add comment to Firebase and get the complete comment object back
      const savedComment = await addCommentToDb(taskId, newComment);

      // Update local state with the saved comment
      setTasks(
        tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                comments: [savedComment, ...task.comments],
              }
            : task
        )
      );
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
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
          onAddComment={addComment}
        />
        <KanbanColumn
          title="In Progress"
          tasks={tasks.filter((task) => task.status === 'in-progress')}
          onDragStart={handleDragStart}
          onDrop={(e) => handleDrop(e, 'in-progress')}
          onEditTask={editTask}
          onAddComment={addComment}
        />
        <KanbanColumn
          title="Pending"
          tasks={tasks.filter((task) => task.status === 'pending')}
          onDragStart={handleDragStart}
          onDrop={(e) => handleDrop(e, 'pending')}
          onEditTask={editTask}
          onAddComment={addComment}
        />
        <KanbanColumn
          title="Done"
          tasks={tasks.filter((task) => task.status === 'done')}
          onDragStart={handleDragStart}
          onDrop={(e) => handleDrop(e, 'done')}
          onEditTask={editTask}
          onAddComment={addComment}
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
