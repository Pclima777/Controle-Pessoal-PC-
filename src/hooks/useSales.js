import { useEffect, useState } from 'react';
import { collection, query, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

export function useSales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(collection(db, `users/${auth.currentUser.uid}/sales`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate?.() || new Date(doc.data().date),
      }));
      setSales(data.sort((a, b) => b.date - a.date));
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const addSale = async (sale) => {
    if (!auth.currentUser) return;
    await addDoc(collection(db, `users/${auth.currentUser.uid}/sales`), {
      ...sale,
      date: new Date(sale.date),
      createdAt: new Date(),
    });
  };

  const deleteSale = async (id) => {
    if (!auth.currentUser) return;
    await deleteDoc(doc(db, `users/${auth.currentUser.uid}/sales/${id}`));
  };

  const updateSale = async (id, updates) => {
    if (!auth.currentUser) return;
    await updateDoc(doc(db, `users/${auth.currentUser.uid}/sales/${id}`), updates);
  };

  return { sales, loading, addSale, deleteSale, updateSale };
}
