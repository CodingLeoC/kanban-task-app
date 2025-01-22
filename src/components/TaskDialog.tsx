import { Task, Comment } from '@/types';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { format } from 'date-fns';
import { commentsService } from '@/services/comments';

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
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  useEffect(() => {
    setEditedTask(task);
    if (isOpen) {
      loadComments();
    }
  }, [task, isOpen]);

  const loadComments = async () => {
    setIsLoadingComments(true);
    try {
      const taskComments = await commentsService.getTaskComments(task.id);
      setComments(taskComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleSave = () => {
    onEditTask(task.id, editedTask);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTask(task);
    setIsEditing(false);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      const comment = await commentsService.createComment(task.id, newComment.trim());
      setComments([comment, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await commentsService.deleteComment(task.id, commentId);
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleEditComment = async (commentId: string, newContent: string) => {
    try {
      await commentsService.updateComment(task.id, commentId, newContent);
      setComments(
        comments.map(comment =>
          comment.id === commentId
            ? { ...comment, content: newContent, updatedAt: new Date() }
            : comment
        )
      );
    } catch (error) {
      console.error('Error updating comment:', error);
    }
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
              <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  {isEditing ? 'Edit Task' : task.title}
                </DialogTitle>
                
                {/* Task Details */}
                <div className="mt-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editedTask.title}
                        onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="Task title"
                      />
                      <textarea
                        value={editedTask.description}
                        onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="Task description"
                        rows={3}
                      />
                      <div className="flex gap-4">
                        <input
                          type="date"
                          value={editedTask.dueDate || ''}
                          onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                          className="px-3 py-2 border rounded-md"
                        />
                        <select
                          value={editedTask.priority || 'low'}
                          onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value as Task['priority'] })}
                          className="px-3 py-2 border rounded-md"
                        >
                          <option value="low">Low Priority</option>
                          <option value="medium">Medium Priority</option>
                          <option value="high">High Priority</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-gray-700">{task.description}</p>
                      {task.dueDate && (
                        <p className="text-sm text-gray-500">
                          Due: {format(new Date(task.dueDate), 'PPP')}
                        </p>
                      )}
                      {task.priority && (
                        <p className="text-sm text-gray-500 capitalize">
                          Priority: {task.priority}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Comments Section */}
                <div className="mt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Comments</h4>
                  
                  {/* Add Comment */}
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-md"
                      placeholder="Add a comment..."
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                    />
                    <button
                      onClick={handleAddComment}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-4">
                    {isLoadingComments ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      </div>
                    ) : (
                      comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-50 p-3 rounded-md">
                          <p className="text-gray-700">{comment.content}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {format(comment.createdAt, 'PPp')}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-xs text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-end gap-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
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
