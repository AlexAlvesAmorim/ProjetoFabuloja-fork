import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const masculineProducts: Prisma.ProductCreateInput[] = [
  {
    name: 'Camisa Lacoste',
    price: 90.0,
    image: '/manvitrine/lacostetshirt.avif',
    details: 'Disponível em P, M, G, GG. Cores: Preto, Branco, Vermelho, Cinza',
    category: { connect: { name: 'Masculina' } },
  },
  {
    name: 'Camisa Hugo Boss',
    price: 95.0,
    image: '/manvitrine/hugoboss.webp',
    details: 'Estilo premium com corte impecável',
    category: { connect: { name: 'Masculina' } },
  },
  {
    name: 'Camisa Ecko Unltd',
    price: 89.0,
    image: '/manvitrine/eckoUnltd.webp',
    details: 'Street style com atitude',
    category: { connect: { name: 'Masculina' } },
  },
  {
    name: 'Camisa Nike Sportswear',
    price: 99.0,
    image: '/manvitrine/nikeSportWear.webp',
    details: 'Conforto e performance',
    category: { connect: { name: 'Masculina' } },
  },
  {
    name: 'Camisa Adidas Essentials',
    price: 100.0,
    image: '/manvitrine/adidasEssentials.webp',
    details: 'Clássico que nunca sai de moda',
    category: { connect: { name: 'Masculina' } },
  },
  {
    name: 'Camisa Calvin Klein',
    price: 97.0,
    image: '/manvitrine/calvinKlein.webp',
    details: 'Minimalismo e sofisticação',
    category: { connect: { name: 'Masculina' } },
  },
  {
    name: 'Camisa Polo Ralph Lauren',
    price: 89.0,
    image: '/manvitrine/poloRalphLauren.webp',
    details: 'Tradição americana com estilo',
    category: { connect: { name: 'Masculina' } },
  },
  {
    name: 'Camisa Oakley',
    price: 87.0,
    image: '/manvitrine/oakleyTshirt.webp',
    details: 'Esportivo e funcional',
    category: { connect: { name: 'Masculina' } },
  },
  {
    name: 'Camisa Lacoste Slim',
    price: 90.0,
    image: '/manvitrine/LacosteSlim.avif',
    details: 'Corte slim, disponível em P, M, G, GG',
    category: { connect: { name: 'Masculina' } },
  },
  {
    name: 'Camisa Hugo Boss Elegance',
    price: 95.0,
    image: '/manvitrine/HugoBossElegance.webp',
    details: 'Linha elegance com acabamento premium',
    category: { connect: { name: 'Masculina' } },
  },
  {
    name: 'Camisa Ecko Unltd Urbanwear',
    price: 89.0,
    image: '/manvitrine/EckoUnltdUrbanwear.webp',
    details: 'Urbanwear com identidade street',
    category: { connect: { name: 'Masculina' } },
  },
  {
    name: 'Camisa Nike StreetWear',
    price: 99.0,
    image: '/manvitrine/NikeStreetWear.webp',
    details: 'Streetwear performance',
    category: { connect: { name: 'Masculina' } },
  },
  {
    name: 'Camisa Adidas Originals',
    price: 100.0,
    image: '/manvitrine/AdidasOriginals.webp',
    details: 'Originals clássico reinventado',
    category: { connect: { name: 'Masculina' } },
  },
  {
    name: 'Camisa Calvin Klein Underwear',
    price: 97.0,
    image: '/manvitrine/CalvinKleinUnderWear.webp',
    details: 'Linha underwear premium',
    category: { connect: { name: 'Masculina' } },
  },
  {
    name: 'Camisa Polo Ralph Lauren Western',
    price: 89.0,
    image: '/manvitrine/PoloRalphLaurenWestern.webp',
    details: 'Estilo western autêntico',
    category: { connect: { name: 'Masculina' } },
  },
  {
    name: 'Camisa Oakley Lifestyle',
    price: 87.0,
    image: '/manvitrine/OakleyLifestyle.webp',
    details: 'Lifestyle esportivo casual',
    category: { connect: { name: 'Masculina' } },
  },
];

const feminineProducts: Prisma.ProductCreateInput[] = [
  {
    name: 'Conjunto Boho Chic',
    price: 87.0,
    image: '/womanvitrine/conjuntobohochicjeans.webp',
    details: 'Estilo leve e romântico',
    category: { connect: { name: 'Feminina' } },
  },
  {
    name: 'Conjunto Cropped Jeans',
    price: 90.0,
    image: '/womanvitrine/conjuntocroppedjeans.webp',
    details: 'Casual com toque moderno',
    category: { connect: { name: 'Feminina' } },
  },
  {
    name: 'Jaqueta Jeans + Saia',
    price: 95.0,
    image: '/womanvitrine/conjuntojaquetajeansblusasaia.webp',
    details: 'Look completo e estiloso',
    category: { connect: { name: 'Feminina' } },
  },
  {
    name: 'Cropped + Saia Jeans',
    price: 89.0,
    image: '/womanvitrine/conjuntocroppedjeanscinto.webp',
    details: 'Juventude e atitude',
    category: { connect: { name: 'Feminina' } },
  },
  {
    name: 'Cropped Tricô + Short',
    price: 99.0,
    image: '/womanvitrine/conjuntocroppedtricoshortjeans.webp',
    details: 'Conforto com elegância',
    category: { connect: { name: 'Feminina' } },
  },
  {
    name: 'Cropped Preto + Short',
    price: 100.0,
    image: '/womanvitrine/conjuntocroppedpretojeans.webp',
    details: 'Clássico que nunca falha',
    category: { connect: { name: 'Feminina' } },
  },
  {
    name: 'Conjunto Jeans Total',
    price: 97.0,
    image: '/womanvitrine/conjuntojeans.webp',
    details: 'Look poderoso e atemporal',
    category: { connect: { name: 'Feminina' } },
  },
  {
    name: 'Cropped Florido + Jeans',
    price: 89.0,
    image: '/womanvitrine/conjuntoCroppedFloridojeans.webp',
    details: 'Romantismo com atitude',
    category: { connect: { name: 'Feminina' } },
  },
  {
    name: 'Conjunto Cropped Bandana',
    price: 92.0,
    image: '/womanvitrine/conjuntoCroppedBandanaPretoJeans.webp',
    details: 'Estilo urbano com bandana',
    category: { connect: { name: 'Feminina' } },
  },
  {
    name: 'Conjunto Cropped Listrado',
    price: 92.0,
    image: '/womanvitrine/conjuntoCroppedListradoJeans.webp',
    details: 'Listras clássicas modernas',
    category: { connect: { name: 'Feminina' } },
  },
  {
    name: 'Conjunto Cropped Azul',
    price: 90.0,
    image: '/womanvitrine/conjuntoCroppedAzuljeans.webp',
    details: 'Azul jeans versátil',
    category: { connect: { name: 'Feminina' } },
  },
  {
    name: 'Conjunto Cropped Amarelo',
    price: 90.0,
    image: '/womanvitrine/conjuntoCroppedAmareloJeans.webp',
    details: 'Amarelo vibrante para o verão',
    category: { connect: { name: 'Feminina' } },
  },
  {
    name: 'Conjunto Body + Bermuda',
    price: 95.0,
    image: '/womanvitrine/conjuntoBodyBermuda.webp',
    details: 'Body ajustado com bermuda',
    category: { connect: { name: 'Feminina' } },
  },
  {
    name: 'Conjunto Blusinha Azul Listrado',
    price: 88.0,
    image: '/womanvitrine/conjuntoBlusinhaAzulShortListrado.webp',
    details: 'Blusa listrada com short',
    category: { connect: { name: 'Feminina' } },
  },
  {
    name: 'Conjunto Blusinha Azul',
    price: 88.0,
    image: '/womanvitrine/conjuntoBlusinhaAzulShortListrado2.webp',
    details: 'Variante da blusa azul',
    category: { connect: { name: 'Feminina' } },
  },
  {
    name: 'Conjunto Marrom Jeans',
    price: 90.0,
    image: '/womanvitrine/conjuntoCroppedmarromjeans.webp',
    details: 'Tons terrosos elegantes',
    category: { connect: { name: 'Feminina' } },
  },
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Reset products so the seed is idempotent
  await prisma.product.deleteMany();
  console.log('✅ Existing products removed');

  // Create store
  const store = await prisma.store.upsert({
    where: { id: 'main-store' },
    update: {},
    create: {
      id: 'main-store',
      name: 'Fabulosa Modas',
      whatsappNumber: '5521976807111',
      email: 'contato@fabulosamodas.com',
      phone: '(21) 99999-8888',
      address: 'Rua Josué, 0000 - Cidade de Deus, RJ',
      businessHours: {
        weekdays: '10h às 21h',
        saturday: '10h às 19h',
        sunday: 'Fechado',
        holidays: 'Fechado',
      },
      socialLinks: {
        instagram: 'https://instagram.com/fabulosamodas',
        facebook: 'https://facebook.com/fabulosamodas',
        twitter: 'https://twitter.com/fabulosamodas',
      },
    },
  });
  console.log('✅ Store created:', store.name);

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Masculina' },
      update: {},
      create: { name: 'Masculina', label: 'Masculino', storeId: store.id },
    }),
    prisma.category.upsert({
      where: { name: 'Feminina' },
      update: {},
      create: { name: 'Feminina', label: 'Feminina', storeId: store.id },
    }),
  ]);
  console.log('✅ Categories created:', categories.map(c => c.label).join(', '));

  // Create products
  const masculineCategory = categories.find(c => c.name === 'Masculina')!;
  const feminineCategory = categories.find(c => c.name === 'Feminina')!;

  for (const product of masculineProducts) {
    await prisma.product.create({
      data: {
        ...product,
        category: { connect: { id: masculineCategory.id } },
      },
    });
  }
  console.log(`✅ Created ${masculineProducts.length} masculine products`);

  for (const product of feminineProducts) {
    await prisma.product.create({
      data: {
        ...product,
        category: { connect: { id: feminineCategory.id } },
      },
    });
  }
  console.log(`✅ Created ${feminineProducts.length} feminine products`);

  // Create admin user
  const passwordHash = await bcrypt.hash('admin123', 12);

  await prisma.user.upsert({
    where: { email: 'admin@fabulosamodas.com' },
    update: {},
    create: {
      email: 'admin@fabulosamodas.com',
      passwordHash,
      name: 'Admin Fabulosa',
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created: admin@fabulosamodas.com / admin123');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
