import { useState } from 'react';
import { BarChart3, TrendingDown, TrendingUp, Wallet, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useTransactions } from '../hooks/useTransactions';
import { useSales } from '../hooks/useSales';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Dashboard({ setCurrentPage }) {
  const { transactions } = useTransactions();
  const { sales } = useSales();
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const startDate = startOfMonth(selectedMonth);
  const endDate = endOfMonth(selectedMonth);

  const monthDays = eachDayOfInterval({ start: startDate, end: endDate });

  const calculateDayBalance = (day) => {
    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);

    const dayTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate >= dayStart && tDate <= dayEnd;
    });

    const daySales = sales.filter(s => {
      const sDate = new Date(s.date);
      return sDate >= dayStart && sDate <= dayEnd;
    });

    const transactionBalance = dayTransactions.reduce((sum, t) => {
      return sum + (t.type === 'income' ? t.amount : -t.amount);
    }, 0);

    const salesBalance = daySales.reduce((sum, s) => {
      return sum + (s.totalPrice || 0);
    }, 0);

    return transactionBalance + salesBalance;
  };

  const monthBalance = monthDays.reduce((sum, day) => sum + calculateDayBalance(day), 0);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0) +
    sales.reduce((sum, s) => sum + (s.totalPrice || 0), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const criticalDays = monthDays.filter(day => calculateDayBalance(day) < 0);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Controle Pessoal</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </header>

      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-4">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="px-4 py-2 text-blue-600 font-semibold border-b-2 border-blue-600"
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentPage('transactions')}
            className="px-4 py-2 text-gray-600 hover:text-blue-600"
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
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Saldo Total</p>
                <p className="text-3xl font-bold text-gray-900">
                  R$ {(monthBalance).toFixed(2).replace('.', ',')}
                </p>
              </div>
              <Wallet className="w-12 h-12 text-blue-600 opacity-50" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Recebido</p>
                <p className="text-3xl font-bold text-green-600">
                  R$ {totalIncome.toFixed(2).replace('.', ',')}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-600 opacity-50" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Gasto</p>
                <p className="text-3xl font-bold text-red-600">
                  R$ {totalExpense.toFixed(2).replace('.', ',')}
                </p>
              </div>
              <TrendingDown className="w-12 h-12 text-red-600 opacity-50" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Fluxo de Caixa - {format(selectedMonth, 'MMMM yyyy', { locale: ptBR })}</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                ← Anterior
              </button>
              <button
                onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Próximo →
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="grid grid-cols-7 gap-2">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map(day => (
                <div key={day} className="text-center font-semibold text-gray-600 py-2">
                  {day}
                </div>
              ))}
              {monthDays.map(day => {
                const balance = calculateDayBalance(day);
                const isToday = day.toDateString() === new Date().toDateString();

                return (
                  <div
                    key={day.toString()}
                    className={`p-3 rounded text-center text-sm ${
                      balance < 0 ? 'bg-red-100 text-red-700' :
                      balance > 0 ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    } ${isToday ? 'border-2 border-blue-600' : ''}`}
                  >
                    <div className="font-semibold">{day.getDate()}</div>
                    <div className="text-xs">R$ {balance.toFixed(2).replace('.', ',')}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {criticalDays.length > 0 && (
          <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
            <h3 className="text-lg font-bold text-red-700 mb-2">⚠️ Dias Críticos</h3>
            <p className="text-red-600">
              {criticalDays.map(d => d.getDate()).join(', ')} são dias com fluxo de caixa negativo.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
