import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Transactions({ setCurrentPage }) {
  const { transactions, addTransaction, deleteTransaction } = useTransactions();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: 'other',
    date: new Date().toISOString().split('T')[0],
  });

  const categories = {
    expense: ['Alimentação', 'Transporte', 'Saúde', 'Diversão', 'Outros'],
    income: ['Salário', 'Freelance', 'Investimento', 'Outros'],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;

    await addTransaction({
      ...formData,
      amount: parseFloat(formData.amount),
    });

    setFormData({
      description: '',
      amount: '',
      type: 'expense',
      category: 'other',
      date: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Controle Pessoal</h1>
        </div>
      </header>

      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-4">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="px-4 py-2 text-gray-600 hover:text-blue-600"
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentPage('transactions')}
            className="px-4 py-2 text-blue-600 font-semibold border-b-2 border-blue-600"
          >
            Financeiro Pessoal
          </button>
          <button
            onClick={() => setCurrentPage('shop')}
            className="px-4 py-2 text-gray-600 hover:text-blue-600"
          >
            Controle da Loja
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-1">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Nova Transação</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Tipo</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value, category: 'other' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  >
                    <option value="expense">Despesa</option>
                    <option value="income">Receita</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Categoria</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  >
                    {categories[formData.type].map(cat => (
                      <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Descrição</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Valor</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Data</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar
                </button>
              </form>
            </div>
          </div>

          <div className="col-span-2">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Transações</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {transactions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Nenhuma transação registrada</p>
                ) : (
                  transactions.map(transaction => (
                    <div
                      key={transaction.id}
                      className={`flex justify-between items-center p-3 rounded ${
                        transaction.type === 'income' ? 'bg-green-50' : 'bg-red-50'
                      }`}
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-500">
                          {format(transaction.date, 'dd MMM yyyy', { locale: ptBR })}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`font-bold text-lg ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'income' ? '+' : '-'} R$ {transaction.amount.toFixed(2).replace('.', ',')}
                        </span>
                        <button
                          onClick={() => deleteTransaction(transaction.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
