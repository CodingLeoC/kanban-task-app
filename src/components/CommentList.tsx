import React from 'react';
import { Comment } from '@/types';

interface CommentListProps {
  comments: Comment[];
}

export const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  return (
    <div className="comments-container space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Comments</h3>
      {comments.map((comment) => (
        <div key={comment.id} className="comment bg-gray-50 p-4 rounded-lg">
          <div className="comment-header flex justify-between text-sm text-gray-500 mb-2">
            <span className="comment-author font-medium">{comment.author}</span>
            <span className="comment-date">{comment.createdAt.toLocaleDateString()}</span>
          </div>
          <p className="comment-content text-gray-700">{comment.content}</p>
        </div>
      ))}
    </div>
  );
};
