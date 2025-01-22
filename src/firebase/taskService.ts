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
  
  // Fetch comments for each task
  const tasks = await Promise.all(
    snapshot.docs.map(async (doc) => {
      const taskData = doc.data();
      const comments = await getComments(doc.id);
      return { 
        id: doc.id, 
        ...taskData, 
        comments 
      };
    })
  );
  
  return tasks;
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
  return snapshot.docs.map(doc => ({ 
    id: doc.id,
    taskId,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() // Convert Firestore Timestamp to Date
  }));
};

export const addComment = async (taskId: string, comment: Omit<Comment, 'id'>) => {
  const commentsRef = collection(db, 'tasks', taskId, 'comments');
  const docRef = await addDoc(commentsRef, {
    ...comment,
    createdAt: serverTimestamp(),
  });
  
  // Return the new comment with its ID
  return {
    id: docRef.id,
    ...comment,
    createdAt: new Date(), // Use current date for immediate UI update
  };
};

export const deleteComment = async (taskId: string, commentId: string) => {
  const commentRef = doc(db, 'tasks', taskId, 'comments', commentId);
  await deleteDoc(commentRef);
}; 