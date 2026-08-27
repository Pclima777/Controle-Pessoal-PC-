import { useEffect, useState } from 'react';
import { collection, query, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(collection(db, `users/${auth.currentUser.uid}/transactions`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate?.() || new Date(doc.data().date),
      }));
      setTransactions(data.sort((a, b) => b.date - a.date));
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const addTransaction = async (transaction) => {
    if (!auth.currentUser) return;
    await addDoc(collection(db, `users/${auth.currentUser.uid}/transactions`), {
      ...transaction,
      date: new Date(transaction.date),
      createdAt: new Date(),
    });
  };

  const deleteTransaction = async (id) => {
    if (!auth.currentUser) return;
    await deleteDoc(doc(db, `users/${auth.currentUser.uid}/transactions/${id}`));
  };

  const updateTransaction = async (id, updates) => {
    if (!auth.currentUser) return;
    await updateDoc(doc(db, `users/${auth.currentUser.uid}/transactions/${id}`), updates);
  };

  return { transactions, loading, addTransaction, deleteTransaction, updateTransaction };
}
