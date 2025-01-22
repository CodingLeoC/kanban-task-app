import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  getDocs,
  orderBy,
  Timestamp,
  where
} from 'firebase/firestore';
import { db } from './firebase';

export interface Comment {
  id: string;
  taskId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const getCommentsCollection = (taskId: string) => 
  collection(db, 'tasks', taskId, 'comments');

export const commentsService = {
  async getTaskComments(taskId: string): Promise<Comment[]> {
    const commentsQuery = query(
      getCommentsCollection(taskId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(commentsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      taskId,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp).toDate(),
      updatedAt: (doc.data().updatedAt as Timestamp).toDate(),
    } as Comment));
  },

  async createComment(taskId: string, content: string): Promise<Comment> {
    const now = new Date();
    const docRef = await addDoc(getCommentsCollection(taskId), {
      content,
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
    });

    return {
      id: docRef.id,
      taskId,
      content,
      createdAt: now,
      updatedAt: now,
    };
  },

  async updateComment(taskId: string, commentId: string, content: string): Promise<void> {
    const docRef = doc(db, 'tasks', taskId, 'comments', commentId);
    await updateDoc(docRef, {
      content,
      updatedAt: Timestamp.fromDate(new Date()),
    });
  },

  async deleteComment(taskId: string, commentId: string): Promise<void> {
    const docRef = doc(db, 'tasks', taskId, 'comments', commentId);
    await deleteDoc(docRef);
  },
};
