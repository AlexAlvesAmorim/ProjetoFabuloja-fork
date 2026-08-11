import { Product, Category } from '../types';

export type { Product, Category };

export const masculineProducts: Product[] = [
  {
    id: 1,
    name: 'Camisa Lacoste',
    price: 'R$ 90,00',
    image: '/manvitrine/lacostetshirt.avif',
    details: 'Disponível em P, M, G, GG. Cores: Preto, Branco, Vermelho, Cinza',
    category: 'Masculina',
  },
  {
    id: 2,
    name: 'Camisa Hugo Boss',
    price: 'R$ 95,00',
    image: '/manvitrine/hugoboss.webp',
    details: 'Estilo premium com corte impecável',
    category: 'Masculina',
  },
  {
    id: 3,
    name: 'Camisa Ecko Unltd',
    price: 'R$ 89,00',
    image: '/manvitrine/eckoUnltd.webp',
    details: 'Street style com atitude',
    category: 'Masculina',
  },
  {
    id: 4,
    name: 'Camisa Nike Sportswear',
    price: 'R$ 99,00',
    image: '/manvitrine/nikeSportWear.webp',
    details: 'Conforto e performance',
    category: 'Masculina',
  },
  {
    id: 5,
    name: 'Camisa Adidas Essentials',
    price: 'R$ 100,00',
    image: '/manvitrine/adidasEssentials.webp',
    details: 'Clássico que nunca sai de moda',
    category: 'Masculina',
  },
  {
    id: 6,
    name: 'Camisa Calvin Klein',
    price: 'R$ 97,00',
    image: '/manvitrine/calvinKlein.webp',
    details: 'Minimalismo e sofisticação',
    category: 'Masculina',
  },
  {
    id: 7,
    name: 'Camisa Polo Ralph Lauren',
    price: 'R$ 89,00',
    image: '/manvitrine/poloRalphLauren.webp',
    details: 'Tradição americana com estilo',
    category: 'Masculina',
  },
  {
    id: 8,
    name: 'Camisa Oakley',
    price: 'R$ 87,00',
    image: '/manvitrine/oakleyTshirt.webp',
    details: 'Esportivo e funcional',
    category: 'Masculina',
  },
  {
    id: 9,
    name: 'Camisa Lacoste Slim',
    price: 'R$ 90,00',
    image: '/manvitrine/LacosteSlim.avif',
    details: 'Corte slim, disponível em P, M, G, GG',
    category: 'Masculina',
  },
  {
    id: 10,
    name: 'Camisa Hugo Boss Elegance',
    price: 'R$ 95,00',
    image: '/manvitrine/HugoBossElegance.webp',
    details: 'Linha elegance com acabamento premium',
    category: 'Masculina',
  },
  {
    id: 11,
    name: 'Camisa Ecko Unltd Urbanwear',
    price: 'R$ 89,00',
    image: '/manvitrine/EckoUnltdUrbanwear.webp',
    details: 'Urbanwear com identidade street',
    category: 'Masculina',
  },
  {
    id: 12,
    name: 'Camisa Nike StreetWear',
    price: 'R$ 99,00',
    image: '/manvitrine/NikeStreetWear.webp',
    details: 'Streetwear performance',
    category: 'Masculina',
  },
  {
    id: 13,
    name: 'Camisa Adidas Originals',
    price: 'R$ 100,00',
    image: '/manvitrine/AdidasOriginals.webp',
    details: 'Originals clássico reinventado',
    category: 'Masculina',
  },
  {
    id: 14,
    name: 'Camisa Calvin Klein Underwear',
    price: 'R$ 97,00',
    image: '/manvitrine/CalvinKleinUnderWear.webp',
    details: 'Linha underwear premium',
    category: 'Masculina',
  },
  {
    id: 15,
    name: 'Camisa Polo Ralph Lauren Western',
    price: 'R$ 89,00',
    image: '/manvitrine/PoloRalphLaurenWestern.webp',
    details: 'Estilo western autêntico',
    category: 'Masculina',
  },
  {
    id: 16,
    name: 'Camisa Oakley Lifestyle',
    price: 'R$ 87,00',
    image: '/manvitrine/OakleyLifestyle.webp',
    details: 'Lifestyle esportivo casual',
    category: 'Masculina',
  },
];

export const feminineProducts: Product[] = [
  {
    id: 17,
    name: 'Conjunto Boho Chic',
    price: 'R$ 87,00',
    image: '/womanvitrine/conjuntobohochicjeans.webp',
    details: 'Estilo leve e romântico',
    category: 'Feminina',
  },
  {
    id: 18,
    name: 'Conjunto Cropped Jeans',
    price: 'R$ 90,00',
    image: '/womanvitrine/conjuntocroppedjeans.webp',
    details: 'Casual com toque moderno',
    category: 'Feminina',
  },
  {
    id: 19,
    name: 'Jaqueta Jeans + Saia',
    price: 'R$ 95,00',
    image: '/womanvitrine/conjuntojaquetajeansblusasaia.webp',
    details: 'Look completo e estiloso',
    category: 'Feminina',
  },
  {
    id: 20,
    name: 'Cropped + Saia Jeans',
    price: 'R$ 89,00',
    image: '/womanvitrine/conjuntocroppedjeanscinto.webp',
    details: 'Juventude e atitude',
    category: 'Feminina',
  },
  {
    id: 21,
    name: 'Cropped Tricô + Short',
    price: 'R$ 99,00',
    image: '/womanvitrine/conjuntocroppedtricoshortjeans.webp',
    details: 'Conforto com elegância',
    category: 'Feminina',
  },
  {
    id: 22,
    name: 'Cropped Preto + Short',
    price: 'R$ 100,00',
    image: '/womanvitrine/conjuntocroppedpretojeans.webp',
    details: 'Clássico que nunca falha',
    category: 'Feminina',
  },
  {
    id: 23,
    name: 'Conjunto Jeans Total',
    price: 'R$ 97,00',
    image: '/womanvitrine/conjuntojeans.webp',
    details: 'Look poderoso e atemporal',
    category: 'Feminina',
  },
  {
    id: 24,
    name: 'Cropped Florido + Jeans',
    price: 'R$ 89,00',
    image: '/womanvitrine/conjuntoCroppedFloridojeans.webp',
    details: 'Romantismo com atitude',
    category: 'Feminina',
  },
  {
    id: 25,
    name: 'Conjunto Cropped Bandana',
    price: 'R$ 92,00',
    image: '/womanvitrine/conjuntoCroppedBandanaPretoJeans.webp',
    details: 'Estilo urbano com bandana',
    category: 'Feminina',
  },
  {
    id: 26,
    name: 'Conjunto Cropped Listrado',
    price: 'R$ 92,00',
    image: '/womanvitrine/conjuntoCroppedListradoJeans.webp',
    details: 'Listras clássicas modernas',
    category: 'Feminina',
  },
  {
    id: 27,
    name: 'Conjunto Cropped Azul',
    price: 'R$ 90,00',
    image: '/womanvitrine/conjuntoCroppedAzuljeans.webp',
    details: 'Azul jeans versátil',
    category: 'Feminina',
  },
  {
    id: 28,
    name: 'Conjunto Cropped Amarelo',
    price: 'R$ 90,00',
    image: '/womanvitrine/conjuntoCroppedAmareloJeans.webp',
    details: 'Amarelo vibrante para o verão',
    category: 'Feminina',
  },
  {
    id: 29,
    name: 'Conjunto Body + Bermuda',
    price: 'R$ 95,00',
    image: '/womanvitrine/conjuntoBodyBermuda.webp',
    details: 'Body ajustado com bermuda',
    category: 'Feminina',
  },
  {
    id: 30,
    name: 'Conjunto Blusinha Azul Listrado',
    price: 'R$ 88,00',
    image: '/womanvitrine/conjuntoBlusinhaAzulShortListrado.webp',
    details: 'Blusa listrada com short',
    category: 'Feminina',
  },
  {
    id: 31,
    name: 'Conjunto Blusinha Azul',
    price: 'R$ 88,00',
    image: '/womanvitrine/conjuntoBlusinhaAzulShortListrado2.webp',
    details: 'Variante da blusa azul',
    category: 'Feminina',
  },
  {
    id: 32,
    name: 'Conjunto Marrom Jeans',
    price: 'R$ 90,00',
    image: '/womanvitrine/conjuntoCroppedmarromjeans.webp',
    details: 'Tons terrosos elegantes',
    category: 'Feminina',
  },
];

export const collections: Category[] = [
  {
    id: 'masculina',
    name: 'Masculina',
    label: 'Masculino',
    products: masculineProducts,
  },
  {
    id: 'feminina',
    name: 'Feminina',
    label: 'Feminina',
    products: feminineProducts,
  },
];

export const getProductsByCategory = (category: 'Masculina' | 'Feminina'): Product[] => {
  return category === 'Masculina' ? masculineProducts : feminineProducts;
};

export const getProductById = (id: number): Product | undefined => {
  return [...masculineProducts, ...feminineProducts].find(p => p.id === id);
};

export const getAllProducts = (): Product[] => {
  return [...masculineProducts, ...feminineProducts];
};
