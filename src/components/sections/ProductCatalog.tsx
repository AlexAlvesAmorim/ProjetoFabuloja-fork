import { ProductCard } from '../ui/ProductCard';
import { ProductModal } from '../ui/ProductModal';
import { useCollections } from '../../hooks/useCollections';
import { useProductModal } from '../../hooks/useProductModal';

export const ProductCatalog = () => {
  const { activeTab, activeLabel, products, handleTabChange, collections, loading } =
    useCollections();
  const { selectedProduct, openModal, closeModal, trackBuyClick, trackWhatsAppRedirect } =
    useProductModal();

  return (
    <>
      <ProductModal
        product={selectedProduct}
        onClose={closeModal}
        onTrackBuyClick={trackBuyClick}
        onTrackWhatsAppRedirect={trackWhatsAppRedirect}
      />

      <section id="produtos" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">Coleção Fabulosa</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A elegância essencial para a moda moderna. Descubra as peças que combinam com seu
              estilo.
            </p>
          </div>

          <div className="flex justify-center mb-12">
            <div className="bg-white/80 backdrop-blur-md rounded-full shadow-xl p-2 inline-flex">
              {collections.map(collection => (
                <button
                  key={collection.id}
                  onClick={() => handleTabChange(collection.name)}
                  className={`px-10 py-4 rounded-full text-lg font-semibold transition-all ${
                    activeTab === collection.name
                      ? 'bg-cyan-600 text-white shadow-lg'
                      : 'text-gray-700 hover:text-sky-600'
                  }`}
                >
                  {collection.label}
                </button>
              ))}
            </div>
          </div>

          <section id={`secao-${activeTab.toLowerCase()}`} className="mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-12">
              Coleção {activeLabel}
            </h2>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-3xl overflow-hidden shadow-lg animate-pulse"
                  >
                    <div className="aspect-square bg-gray-200"></div>
                    <div className="p-6 space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map(item => (
                  <ProductCard key={item.id} item={item} openModal={openModal} />
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
    </>
  );
};
