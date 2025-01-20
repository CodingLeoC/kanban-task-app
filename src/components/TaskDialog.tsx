import { Task, Comment } from '@/types';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { format } from 'date-fns';

interface TaskDialogProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onEditTask: (taskId: string, updatedTask: Partial<Task>) => void;
}

export default function TaskDialog({ task, isOpen, onClose, onEditTask }: TaskDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task>(task);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    setEditedTask(task);
  }, [task]);

  const handleSave = () => {
    onEditTask(task.id, editedTask);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTask(task);
    setIsEditing(false);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      text: newComment.trim(),
      createdAt: new Date().toISOString(),
    };

    const updatedComments = [...(editedTask.comments || []), comment];
    setEditedTask({ ...editedTask, comments: updatedComments });
    onEditTask(task.id, { comments: updatedComments });
    setNewComment('');
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {isEditing ? (
                  <>
                    <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900">
                      Edit Task
                    </DialogTitle>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                          Title
                        </label>
                        <input
                          type="text"
                          id="title"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-600"
                          value={editedTask.title}
                          onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Description
                        </label>
                        <textarea
                          id="description"
                          rows={3}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-600"
                          value={editedTask.description}
                          onChange={(e) =>
                            setEditedTask({ ...editedTask, description: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <select
                          id="status"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-600"
                          value={editedTask.status}
                          onChange={(e) =>
                            setEditedTask({
                              ...editedTask,
                              status: e.target.value as Task['status'],
                            })
                          }
                        >
                          <option value="todo">To Do</option>
                          <option value="in-progress">In Progress</option>
                          <option value="pending">Pending</option>
                          <option value="done">Done</option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="priority"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Priority
                        </label>
                        <select
                          id="priority"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-600"
                          value={editedTask.priority || 'low'}
                          onChange={(e) =>
                            setEditedTask({
                              ...editedTask,
                              priority: e.target.value as Task['priority'],
                            })
                          }
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="dueDate"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Due Date
                        </label>
                        <input
                          type="date"
                          id="dueDate"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-600"
                          value={editedTask.dueDate || ''}
                          onChange={(e) =>
                            setEditedTask({ ...editedTask, dueDate: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900">
                      {task.title}
                    </DialogTitle>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-4">{task.description}</p>
                      <div className="flex flex-col gap-2">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Status:</span>
                          <span className="ml-2 text-sm text-gray-600 capitalize">
                            {task.status}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Due Date:</span>
                          <span className="ml-2 text-sm text-gray-600">
                            {task.dueDate
                              ? format(new Date(task.dueDate), 'MMM d, yyyy')
                              : 'No due date'}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Priority:</span>
                          <span className="ml-2 text-sm text-gray-600 capitalize">
                            {task.priority || 'Not set'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <h4 className="text-md font-medium mb-2">Comments</h4>
                      <div className="space-y-4">
                        {editedTask.comments?.map((comment) => (
                          <div
                            key={comment.id}
                            className="p-3 bg-gray-50 rounded-lg"
                          >
                            <p className="text-gray-800">{comment.text}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(comment.createdAt).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex gap-2">
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a comment..."
                          className="flex-1 p-2 border rounded-md text-gray-600"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleAddComment();
                            }
                          }}
                        />
                        <button
                          onClick={handleAddComment}
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </>
                )}

                <div className="mt-6 flex gap-2">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={handleSave}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={() => setIsEditing(true)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={onClose}
                      >
                        Close
                      </button>
                    </>
                  )}
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
