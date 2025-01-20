import { 
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import { Task, Comment } from '../types';

// Tasks
export const getTasks = async () => {
  const tasksRef = collection(db, 'tasks');
  const q = query(tasksRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addTask = async (task: Omit<Task, 'id'>) => {
  const tasksRef = collection(db, 'tasks');
  return await addDoc(tasksRef, {
    ...task,
    createdAt: serverTimestamp(),
  });
};

export const updateTask = async (taskId: string, updates: Partial<Task>) => {
  const taskRef = doc(db, 'tasks', taskId);
  await updateDoc(taskRef, updates);
};

export const deleteTask = async (taskId: string) => {
  const taskRef = doc(db, 'tasks', taskId);
  await deleteDoc(taskRef);
};

// Comments
export const getComments = async (taskId: string) => {
  const commentsRef = collection(db, 'tasks', taskId, 'comments');
  const q = query(commentsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addComment = async (taskId: string, comment: Omit<Comment, 'id'>) => {
  const commentsRef = collection(db, 'tasks', taskId, 'comments');
  return await addDoc(commentsRef, {
    ...comment,
    createdAt: serverTimestamp(),
  });
};

export const deleteComment = async (taskId: string, commentId: string) => {
  const commentRef = doc(db, 'tasks', taskId, 'comments', commentId);
  await deleteDoc(commentRef);
}; 