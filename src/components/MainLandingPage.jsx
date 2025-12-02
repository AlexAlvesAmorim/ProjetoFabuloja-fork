import React, { useState } from "react";
import { ShoppingCart, X } from "lucide-react";

export default function MainLandingPage() {
  const [activeTab, setActiveTab] = useState("Masculino");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openModal = (product) => setSelectedProduct(product);
  const closeModal = () => setSelectedProduct(null);

  const collections = {
    Masculino: [
      { id: 1, name: "Camisa Lacoste", price: "R$ 90,00", image: "/manvitrine/lacostetshirt.avif", details: "Disponível em P, M, G, GG. Cores: Preto, Branco, Vermelho, Cinza" },
      { id: 2, name: "Camisa Hugo Boss", price: "R$ 95,00", image: "/manvitrine/hugoboss.webp", details: "Estilo premium com corte impecável" },
      { id: 3, name: "Camisa Ecko Unltd", price: "R$ 89,00", image: "/manvitrine/eckoUnltd.webp", details: "Street style com atitude" },
      { id: 4, name: "Camisa Nike Sportswear", price: "R$ 99,00", image: "/manvitrine/nikeSportWear.webp", details: "Conforto e performance" },
      { id: 5, name: "Camisa Adidas Essentials", price: "R$ 100,00", image: "/manvitrine/adidasEssentials.webp", details: "Clássico que nunca sai de moda" },
      { id: 6, name: "Camisa Calvin Klein", price: "R$ 97,00", image: "/manvitrine/calvinKlein.webp", details: "Minimalismo e sofisticação" },
      { id: 7, name: "Camisa Polo Ralph Lauren", price: "R$ 89,00", image: "/manvitrine/poloRalphLauren.webp", details: "Tradição americana com estilo" },
      { id: 8, name: "Camisa Oakley", price: "R$ 87,00", image: "/manvitrine/oakleyTshirt.webp", details: "Esportivo e funcional" },
    ],
    Feminina: [
      { id: 20, name: "Conjunto Boho Chic", price: "R$ 87,00", image: "/womanvitrine/conjuntobohochicjeans.webp", details: "Estilo leve e romântico" },
      { id: 21, name: "Conjunto Cropped Jeans", price: "R$ 90,00", image: "/womanvitrine/conjuntocroppedjeans.webp", details: "Casual com toque moderno" },
      { id: 22, name: "Jaqueta Jeans + Saia", price: "R$ 95,00", image: "/womanvitrine/conjuntojaquetajeansblusasaia.webp", details: "Look completo e estiloso" },
      { id: 23, name: "Cropped + Saia Jeans", price: "R$ 89,00", image: "/womanvitrine/conjuntocroppedjeanscinto.webp", details: "Juventude e atitude" },
      { id: 24, name: "Cropped Tricô + Short", price: "R$ 99,00", image: "/womanvitrine/conjuntocroppedtricoshortjeans.webp", details: "Conforto com elegância" },
      { id: 25, name: "Cropped Preto + Short", price: "R$ 100,00", image: "/womanvitrine/conjuntocroppedpretojeans.webp", details: "Clássico que nunca falha" },
      { id: 26, name: "Conjunto Jeans Total", price: "R$ 97,00", image: "/womanvitrine/conjuntojeans.webp", details: "Look poderoso e atemporal" },
      { id: 27, name: "Cropped Florido + Jeans", price: "R$ 89,00", image: "/womanvitrine/conjuntoCroppedFloridojeans.webp", details: "Romantismo com atitude" },
    ],
  };

  return (
    <>
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-white/80 backdrop-blur hover:bg-white text-gray-700 w-10 h-10 rounded-full flex items-center justify-center shadow-lg z-10 transition"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="grid md:grid-cols-2">
              <div className="aspect-square overflow-hidden bg-gray-100">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-8 md:p-12">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">{selectedProduct.name}</h3>
                <p className="text-4xl font-bold text-sky-600 mb-6">{selectedProduct.price}</p>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">{selectedProduct.details}</p>

                <button className="w-full bg-sky-600 hover:bg-sky-700 text-white py-5 rounded-full text-lg font-bold transition transform hover:scale-105 shadow-xl flex items-center justify-center gap-3">
                  <ShoppingCart className="w-6 h-6" />
                  Adicionar ao Carrinho
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <section id="produtos" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Coleção Fabulosa
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A elegância essencial para a moda moderna. Descubra as peças que combinam com seu estilo.
            </p>
          </div>
          <div className="flex justify-center mb-12">
            <div className="bg-white/80 backdrop-blur-md rounded-full shadow-xl p-2 inline-flex">
              <section id="Seção Masculina">
              <button
                onClick={() => setActiveTab("Masculino")}
                className={`px-10 py-4 rounded-full text-lg font-semibold transition-all ${activeTab === "Masculino"
                    ? "bg-cyan-600 text-white shadow-lg"
                    : "text-gray-700 hover:text-sky-600"
                  }`}
              >
                Moda Masculina
              </button>
              </section>
              <section id="Seção Feminina">
              <button
                onClick={() => setActiveTab("Feminina")}
                className={`px-10 py-4 rounded-full text-lg font-semibold transition-all ${activeTab === "Feminina"
                    ? "bg-sky-600 text-white shadow-lg"
                    : "text-gray-700 hover:text-sky-600"
                  }`}
              >
                Moda Feminina
              </button>
              </section>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {collections[activeTab].map((item) => (
              <div
                key={item.id}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                onClick={() => openModal(item)}
              >
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-sky-600">{item.price}</span>
                    <button className="bg-sky-600 text-white p-3 rounded-full hover:bg-cyan-700 transform hover:scale-110 transition shadow-lg">
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="absolute top-4 right-4 bg-sky-600 text-white px-3 py-1 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition">
                  VER DETALHES
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}