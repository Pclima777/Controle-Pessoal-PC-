import { useState } from 'react';
import { Plus, Trash2, ShoppingCart } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useSales } from '../hooks/useSales';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Shop({ setCurrentPage }) {
  const { products, addProduct, deleteProduct } = useProducts();
  const { sales, addSale, deleteSale } = useSales();

  const [activeTab, setActiveTab] = useState('products');

  const [productForm, setProductForm] = useState({
    name: '',
    costPrice: '',
    salePrice: '',
    stock: '',
  });

  const [saleForm, setSaleForm] = useState({
    productId: '',
    quantity: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.costPrice || !productForm.salePrice) return;

    await addProduct({
      name: productForm.name,
      costPrice: parseFloat(productForm.costPrice),
      salePrice: parseFloat(productForm.salePrice),
      stock: parseInt(productForm.stock) || 0,
    });

    setProductForm({ name: '', costPrice: '', salePrice: '', stock: '' });
  };

  const handleAddSale = async (e) => {
    e.preventDefault();
    if (!saleForm.productId || !saleForm.quantity) return;

    const product = products.find(p => p.id === saleForm.productId);
    if (!product) return;

    await addSale({
      productId: saleForm.productId,
      productName: product.name,
      quantity: parseInt(saleForm.quantity),
      unitPrice: product.salePrice,
      totalPrice: product.salePrice * parseInt(saleForm.quantity),
      profit: (product.salePrice - product.costPrice) * parseInt(saleForm.quantity),
      date: new Date(saleForm.date),
    });

    setSaleForm({ productId: '', quantity: '', date: new Date().toISOString().split('T')[0] });
  };

  const totalRevenue = sales.reduce((sum, s) => sum + s.totalPrice, 0);
  const totalProfit = sales.reduce((sum, s) => sum + (s.profit || 0), 0);
  const totalCost = products.reduce((sum, p) => sum + (p.costPrice * p.stock), 0);

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
            className="px-4 py-2 text-gray-600 hover:text-blue-600"
          >
            Financeiro Pessoal
          </button>
          <button
            onClick={() => setCurrentPage('shop')}
            className="px-4 py-2 text-blue-600 font-semibold border-b-2 border-blue-600"
          >
            Controle da Loja
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Faturamento Total</p>
            <p className="text-3xl font-bold text-blue-600">R$ {totalRevenue.toFixed(2).replace('.', ',')}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Lucro Total</p>
            <p className="text-3xl font-bold text-green-600">R$ {totalProfit.toFixed(2).replace('.', ',')}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Estoque (Custo)</p>
            <p className="text-3xl font-bold text-purple-600">R$ {totalCost.toFixed(2).replace('.', ',')}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="border-b">
            <div className="flex gap-4 px-6 py-4">
              <button
                onClick={() => setActiveTab('products')}
                className={`px-4 py-2 font-semibold ${activeTab === 'products' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
              >
                Produtos
              </button>
              <button
                onClick={() => setActiveTab('sales')}
                className={`px-4 py-2 font-semibold ${activeTab === 'sales' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
              >
                Vendas
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'products' ? (
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-bold mb-4">Novo Produto</h3>
                  <form onSubmit={handleAddProduct} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Nome do produto"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      required
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Valor de compra"
                      value={productForm.costPrice}
                      onChange={(e) => setProductForm({ ...productForm, costPrice: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      required
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Valor de venda"
                      value={productForm.salePrice}
                      onChange={(e) => setProductForm({ ...productForm, salePrice: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Quantidade em estoque"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar
                    </button>
                  </form>
                </div>

                <div className="col-span-2">
                  <h3 className="text-lg font-bold mb-4">Produtos ({products.length})</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left">Produto</th>
                          <th className="px-4 py-2 text-center">Estoque</th>
                          <th className="px-4 py-2 text-right">Compra</th>
                          <th className="px-4 py-2 text-right">Venda</th>
                          <th className="px-4 py-2 text-right">Margem</th>
                          <th className="px-4 py-2 text-center">Ação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(product => {
                          const margin = ((product.salePrice - product.costPrice) / product.costPrice * 100).toFixed(1);
                          return (
                            <tr key={product.id} className="border-b hover:bg-gray-50">
                              <td className="px-4 py-3">{product.name}</td>
                              <td className="px-4 py-3 text-center">{product.stock || 0}</td>
                              <td className="px-4 py-3 text-right">R$ {product.costPrice.toFixed(2).replace('.', ',')}</td>
                              <td className="px-4 py-3 text-right text-green-600 font-semibold">R$ {product.salePrice.toFixed(2).replace('.', ',')}</td>
                              <td className="px-4 py-3 text-right text-blue-600">{margin}%</td>
                              <td className="px-4 py-3 text-center">
                                <button
                                  onClick={() => deleteProduct(product.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-bold mb-4">Registrar Venda</h3>
                  <form onSubmit={handleAddSale} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Produto</label>
                      <select
                        value={saleForm.productId}
                        onChange={(e) => setSaleForm({ ...saleForm, productId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        required
                      >
                        <option value="">Selecione um produto</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} (R$ {p.salePrice.toFixed(2).replace('.', ',')})
                          </option>
                        ))}
                      </select>
                    </div>
                    <input
                      type="number"
                      placeholder="Quantidade"
                      value={saleForm.quantity}
                      onChange={(e) => setSaleForm({ ...saleForm, quantity: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      required
                    />
                    <input
                      type="date"
                      value={saleForm.date}
                      onChange={(e) => setSaleForm({ ...saleForm, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Registrar Venda
                    </button>
                  </form>
                </div>

                <div className="col-span-2">
                  <h3 className="text-lg font-bold mb-4">Vendas ({sales.length})</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {sales.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">Nenhuma venda registrada</p>
                    ) : (
                      sales.map(sale => (
                        <div
                          key={sale.id}
                          className="flex justify-between items-center p-3 bg-gray-50 rounded"
                        >
                          <div className="flex-1">
                            <p className="font-semibold">{sale.productName} x{sale.quantity}</p>
                            <p className="text-sm text-gray-500">
                              {format(sale.date, 'dd MMM yyyy', { locale: ptBR })}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-bold text-green-600">R$ {sale.totalPrice.toFixed(2).replace('.', ',')}</p>
                              <p className="text-sm text-gray-500">Lucro: R$ {sale.profit.toFixed(2).replace('.', ',')}</p>
                            </div>
                            <button
                              onClick={() => deleteSale(sale.id)}
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
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
