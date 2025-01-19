export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'pending' | 'done';
  dueDate?: string; // ISO date string, optional
  priority?: 'low' | 'medium' | 'high'; // optional priority field
}
