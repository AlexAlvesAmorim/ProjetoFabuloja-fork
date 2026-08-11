import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Tag, BarChart2, TrendingUp, Loader2, ArrowUpRight, Users } from 'lucide-react';
import { api } from '../../../lib/api';
import { Product, Category, AnalyticsData } from '../../../types/api';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    totalViews: 0,
    totalWhatsAppRedirects: 0,
    conversionRate: 0,
  });
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes, analyticsRes] = await Promise.all([
        api.get<{ data: Product[]; meta: { total: number } }>(
          '/products?limit=5&sortBy=createdAt&sortOrder=desc'
        ),
        api.get<Category[]>('/categories'),
        api.get<AnalyticsData>('/analytics'),
      ]);

      setStats({
        products: productsRes.meta.total,
        categories: categoriesRes.length,
        totalViews: analyticsRes.totalViews,
        totalWhatsAppRedirects: analyticsRes.totalWhatsAppRedirects,
        conversionRate: analyticsRes.conversionRate,
      });
      setRecentProducts(productsRes.data);
    } catch {
      // Error handled by not updating state - loading will be false
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const statCards = [
    {
      label: 'Total de Produtos',
      value: formatNumber(stats.products),
      icon: Package,
      color: 'text-sky-600 bg-sky-100',
      href: '/admin/products',
      trend: '+12%',
      trendUp: true,
    },
    {
      label: 'Categorias',
      value: stats.categories.toString(),
      icon: Tag,
      color: 'text-purple-600 bg-purple-100',
      href: '/admin/categories',
      trend: '0%',
      trendUp: true,
    },
    {
      label: 'Visualizações',
      value: formatNumber(stats.totalViews),
      icon: BarChart2,
      color: 'text-blue-600 bg-blue-100',
      href: '/admin/analytics',
      trend: '+23%',
      trendUp: true,
    },
    {
      label: 'Leads WhatsApp',
      value: formatNumber(stats.totalWhatsAppRedirects),
      icon: Users,
      color: 'text-green-600 bg-green-100',
      href: '/admin/analytics',
      trend: '+18%',
      trendUp: true,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
      </div>
    );
  }

  const renderStatCard = (card: (typeof statCards)[0]) => (
    <Link
      key={card.label}
      to={card.href}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{card.label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
        </div>
        <div className={`p-3 rounded-lg ${card.color}`}>
          <card.icon className="w-6 h-6" />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className={`text-sm font-medium ${card.trendUp ? 'text-green-600' : 'text-red-600'}`}>
          <TrendingUp className="w-3 h-3 inline mr-1" /> {card.trend}
        </span>
        <ArrowUpRight className="w-4 h-4 text-gray-400" />
      </div>
    </Link>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Visão geral da loja</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(renderStatCard)}
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Produtos Recentes</h2>
          <Link
            to="/admin/products"
            className="text-sm text-sky-600 hover:text-sky-700 font-medium"
          >
            Ver todos →
          </Link>
        </div>
        {recentProducts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>Nenhum produto cadastrado</p>
            <Link
              to="/admin/products/new"
              className="text-sky-600 hover:text-sky-700 font-medium ml-2"
            >
              Criar primeiro produto
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentProducts.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <span className="font-medium text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-sky-100 text-sky-700 rounded-full">
                        {product.category?.name || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          product.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {product.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/admin/products/${product.id}/edit`}
                        className="text-sky-600 hover:text-sky-700 text-sm font-medium"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
