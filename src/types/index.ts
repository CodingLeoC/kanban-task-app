export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'pending' | 'done';
  dueDate?: string; // ISO date string, optional
  priority?: 'low' | 'medium' | 'high'; // optional priority field
  comments?: Comment[]; // array of comments
}

export interface Comment {
  id: string;
  text: string;
  createdAt: string;
}
