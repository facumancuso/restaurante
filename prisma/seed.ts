import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding...');
  
  // Crear categorías
  console.log('📁 Creando categorías...');
  
  const categories = [
    { name: 'Papas Fritas' },
    { name: 'Carlitos' },
    { name: 'Lomos' },
    { name: 'Barrolucos' },
    { name: 'Pachatas' },
    { name: 'Pachatas sin carne' },
    { name: 'Pizzas' },
    { name: 'Lomipizzas' },
    { name: 'Promo de Lomo' },
    { name: 'Promo de Pachata' },
    { name: 'Bebidas' },
    { name: 'Cervezas' },
    { name: 'Vinos' },
  ];

  const createdCategories = [];
  
  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: {
        name: category.name,
      },
    });
    createdCategories.push(created);
    console.log(`✅ Categoría creada: ${created.name}`);
  }

  // Crear productos de prueba
  console.log('🍕 Creando productos...');
  
  // Buscar las categorías creadas
  const papasCat = createdCategories.find(c => c.name === 'Papas Fritas');
  const carlitosCat = createdCategories.find(c => c.name === 'Carlitos');
  const lomosCat = createdCategories.find(c => c.name === 'Lomos');
  const barrolucosCat = createdCategories.find(c => c.name === 'Barrolucos');
  const pachatasCat = createdCategories.find(c => c.name === 'Pachatas');
  const pachascnCat = createdCategories.find(c => c.name === 'Pachatas sin carne');
  const pizzasCat = createdCategories.find(c => c.name === 'Pizzas');
  const lomipizzasCat = createdCategories.find(c => c.name === 'Lomipizzas');
  const promoslomoCat = createdCategories.find(c => c.name === 'Promos de Lomo');
  const promospachaCat = createdCategories.find(c => c.name === 'Promos de Pachatas');
  const bebidasCat = createdCategories.find(c => c.name === 'Bebidas');
  const cervezasCat = createdCategories.find(c => c.name === 'Cervezas');
  const vinosCat = createdCategories.find(c => c.name === 'Vinos');

  const products = [
    // Entradas
    {
      name: 'Empanadas de Carne',
      description: 'Empanadas caseras de carne (6 unidades)',
      categoryId: papasCat!.id,
      costPrice: 4.00,
      salePrice: 8.50,
      stock: 30,
      supplier: 'Elaboración Propia',
      unitOfMeasure: 'unidad',
      printingStation: 'cocina',
      allowPriceChange: true
    },
    {
      name: 'Papas Fritas',
      description: 'Papas fritas caseras con sal marina',
      categoryId: papasCat!.id,
      costPrice: 2.00,
      salePrice: 5.50,
      stock: 80,
      supplier: 'Proveedor Local',
      unitOfMeasure: 'unidad',
      printingStation: 'cocina',
      allowPriceChange: true
    },
    
    // Bebidas
    {
      name: 'Coca Cola 500ml',
      description: 'Gaseosa cola 500ml',
      categoryId: carlitosCat!.id,
      costPrice: 1.50,
      salePrice: 3.00,
      stock: 100,
      supplier: 'Distribuidora Central',
      unitOfMeasure: 'unidad',
      printingStation: 'barra',
      allowPriceChange: false
    },
    {
      name: 'Agua Mineral',
      description: 'Agua mineral sin gas 500ml',
      categoryId: carlitosCat!.id,
      costPrice: 0.80,
      salePrice: 2.00,
      stock: 120,
      supplier: 'Distribuidora Central',
      unitOfMeasure: 'unidad',
      printingStation: 'barra',
      allowPriceChange: false
    },
    {
      name: 'Cerveza Artesanal',
      description: 'Cerveza artesanal rubia 500ml',
      categoryId: carlitosCat!.id,
      costPrice: 3.00,
      salePrice: 6.50,
      stock: 60,
      supplier: 'Cervecería Local',
      unitOfMeasure: 'unidad',
      printingStation: 'barra',
      allowPriceChange: true
    },

    // Ensaladas
    {
      name: 'Ensalada César',
      description: 'Lechuga, pollo, parmesano, crutones y aderezo césar',
      categoryId: lomosCat!.id,
      costPrice: 5.00,
      salePrice: 9.50,
      stock: 25,
      supplier: 'Elaboración Propia',
      unitOfMeasure: 'unidad',
      printingStation: 'cocina',
      allowPriceChange: true
    },
    {
      name: 'Ensalada Mixta',
      description: 'Lechuga, tomate, cebolla, aceitunas y aderezo',
      categoryId: lomosCat!.id,
      costPrice: 3.50,
      salePrice: 7.00,
      stock: 30,
      supplier: 'Elaboración Propia',
      unitOfMeasure: 'unidad',
      printingStation: 'cocina',
      allowPriceChange: true
    },

    // Postres
    {
      name: 'Tiramisu',
      description: 'Tiramisu casero con café',
      categoryId: barrolucosCat!.id,
      costPrice: 3.50,
      salePrice: 7.50,
      stock: 20,
      supplier: 'Elaboración Propia',
      unitOfMeasure: 'unidad',
      printingStation: 'cocina',
      allowPriceChange: true
    },
    {
      name: 'Helado Artesanal',
      description: 'Helado artesanal (2 bochas)',
      categoryId: barrolucosCat!.id,
      costPrice: 2.50,
      salePrice: 5.00,
      stock: 25,
      supplier: 'Heladería Local',
      unitOfMeasure: 'unidad',
      printingStation: 'barra',
      allowPriceChange: true
    },

    // Otros
    {
      name: 'Pizza Margherita',
      description: 'Tomate, mozzarella y albahaca',
      categoryId: pachatasCat!.id,
      costPrice: 8.50,
      salePrice: 15.50,
      stock: 50,
      supplier: 'Pizzería Local',
      unitOfMeasure: 'unidad',
      printingStation: 'cocina',
      allowPriceChange: true
    }
  ];

  for (const product of products) {
    const created = await prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        categoryId: product.categoryId,
        costPrice: product.costPrice,
        salePrice: product.salePrice,
        stock: product.stock,
        supplier: product.supplier,
        unitOfMeasure: product.unitOfMeasure as any,
        printingStation: product.printingStation as any,
        allowPriceChange: product.allowPriceChange
      }
    });
    console.log(`✅ Producto creado: ${created.name}`);
  }

  // Mostrar resumen
  const totalCategories = await prisma.category.count();
  const totalProducts = await prisma.product.count();
  
  console.log('\n📊 Resumen de la base de datos:');
  console.log(`   • Categorías: ${totalCategories}`);
  console.log(`   • Productos: ${totalProducts}`);
  console.log('\n🎉 Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });