const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Criar categorias
  const electronics = await prisma.category.upsert({
    where: { name: 'Eletrônicos' },
    update: {},
    create: {
      name: 'Eletrônicos',
      description: 'Produtos eletrônicos e tecnologia',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500'
    }
  })

  const clothing = await prisma.category.upsert({
    where: { name: 'Roupas' },
    update: {},
    create: {
      name: 'Roupas',
      description: 'Vestuário e acessórios',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500'
    }
  })

  const home = await prisma.category.upsert({
    where: { name: 'Casa' },
    update: {},
    create: {
      name: 'Casa',
      description: 'Produtos para casa e decoração',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500'
    }
  })

  // Criar usuário admin
  const hashedPassword = await bcrypt.hash('123456', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@shopmy.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@shopmy.com',
      password: hashedPassword,
      role: 'ADMIN'
    }
  })

  // Criar produtos
  const products = [
    {
      name: 'Smartphone Galaxy S24',
      description: 'O mais novo smartphone da Samsung com tecnologia de ponta',
      price: 2999.99,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
      stock: 50,
      featured: true,
      categoryId: electronics.id
    },
    {
      name: 'Notebook MacBook Pro',
      description: 'Notebook profissional da Apple com chip M3',
      price: 15999.99,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
      stock: 25,
      featured: true,
      categoryId: electronics.id
    },
    {
      name: 'Camiseta Básica',
      description: 'Camiseta de algodão 100% confortável',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
      stock: 100,
      featured: false,
      categoryId: clothing.id
    },
    {
      name: 'Tênis Esportivo',
      description: 'Tênis confortável para corrida e caminhada',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500',
      stock: 75,
      featured: true,
      categoryId: clothing.id
    },
    {
      name: 'Mesa de Escritório',
      description: 'Mesa moderna para home office',
      price: 899.99,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
      stock: 30,
      featured: false,
      categoryId: home.id
    },
    {
      name: 'Cadeira Ergonômica',
      description: 'Cadeira confortável para longas horas de trabalho',
      price: 1299.99,
      image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=500',
      stock: 20,
      featured: true,
      categoryId: home.id
    },
    {
      name: 'Fone de Ouvido Bluetooth',
      description: 'Fone sem fio com cancelamento de ruído',
      price: 399.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      stock: 60,
      featured: false,
      categoryId: electronics.id
    },
    {
      name: 'Relógio Smartwatch',
      description: 'Relógio inteligente com monitoramento de saúde',
      price: 1299.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
      stock: 40,
      featured: true,
      categoryId: electronics.id
    }
  ]

  // Limpar produtos existentes
  await prisma.product.deleteMany({})
  
  for (const product of products) {
    await prisma.product.create({
      data: product
    })
  }

  console.log('Seed executado com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
