import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { api, ApiError } from '../../../lib/api';
import { Product, Category } from '../../../types/api';

export const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    details: '',
    size: '',
    color: '',
    categoryId: '',
    active: true,
  });

  // Fetch categories
  useEffect(() => {
    api
      .get<Category[]>('/categories')
      .then(setCategories)
      .catch(() => setError('Erro ao carregar categorias'));
  }, []);

  // Fetch product if editing
  useEffect(() => {
    if (isEditing && id) {
      setLoading(true);
      api
        .get<Product>(`/products/${id}`)
        .then(product => {
          setFormData({
            name: product.name,
            price: product.price.toString(),
            image: product.image,
            details: product.details || '',
            size: product.size || '',
            color: product.color || '',
            categoryId: product.categoryId,
            active: product.active,
          });
        })
        .catch(() => setError('Erro ao carregar produto'))
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const data = {
        name: formData.name,
        price: parseFloat(formData.price),
        image: formData.image,
        details: formData.details,
        size: formData.size || undefined,
        color: formData.color || undefined,
        categoryId: formData.categoryId,
        active: formData.active,
      };

      if (isEditing && id) {
        await api.put(`/products/${id}`, data);
        setSuccess('Produto atualizado com sucesso!');
      } else {
        await api.post('/products', data);
        setSuccess('Produto criado com sucesso!');
      }

      setTimeout(() => navigate('/admin/products'), 1500);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(isEditing ? 'Erro ao atualizar produto' : 'Erro ao criar produto');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Editar Produto' : 'Novo Produto'}
          </h1>
          <p className="text-gray-500 mt-1">
            {isEditing
              ? 'Atualize as informações do produto'
              : 'Preencha os dados para criar um novo produto'}
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/products')}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          ← Voltar
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
              Nome do Produto <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              placeholder="Ex: Camisa Lacoste"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1.5">
              Preço (R$) <span className="text-red-500">*</span>
            </label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              placeholder="Ex: 90.00"
            />
          </div>
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1.5">
            URL da Imagem <span className="text-red-500">*</span>
          </label>
          <input
            id="image"
            name="image"
            type="text"
            value={formData.image}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            placeholder="Ex: /manvitrine/lacostetshirt.avif ou https://..."
          />
        </div>

        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1.5">
            Categoria <span className="text-red-500">*</span>
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="">Selecione uma categoria</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1.5">
              Tamanho
            </label>
            <input
              id="size"
              name="size"
              type="text"
              maxLength={20}
              value={formData.size}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              placeholder="Ex: P, M, G, GG ou 36-44"
            />
          </div>

          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1.5">
              Cor
            </label>
            <input
              id="color"
              name="color"
              type="text"
              maxLength={50}
              value={formData.color}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              placeholder="Ex: Azul, Preto, Vermelho"
            />
          </div>
        </div>

        <div>
          <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1.5">
            Descrição
          </label>
          <textarea
            id="details"
            name="details"
            value={formData.details}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            placeholder="Descrição do produto"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            id="active"
            name="active"
            type="checkbox"
            checked={formData.active}
            onChange={handleChange}
            className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
          />
          <label htmlFor="active" className="text-sm font-medium text-gray-700">
            Produto ativo (visível na loja)
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
          </button>
        </div>
      </form>
    </div>
  );
};
