import { Product } from '../../types/api';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  item: Product;
  openModal: (product: Product) => void;
}

export const ProductCard = ({ item, openModal }: ProductCardProps) => (
  <div
    onClick={() => openModal(item)}
    className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
  >
    <div className="aspect-square overflow-hidden bg-gray-100">
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-full object-scale-down group-hover:scale-105 transition-transform duration-700"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
    <div className="p-6">
      <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{item.name}</h3>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-sky-600">
          R$ {item.price.toFixed(2).replace('.', ',')}
        </span>
        <button className="bg-sky-600 text-white p-3 rounded-full hover:bg-cyan-700 transform hover:scale-110 transition-all duration-300 shadow-lg">
          <ShoppingCart className="w-5 h-5" />
        </button>
      </div>
    </div>
    <div className="absolute top-4 right-4 bg-sky-600 text-white px-4 py-2 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      VER DETALHES
    </div>
  </div>
);
