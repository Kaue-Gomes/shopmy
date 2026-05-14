# 🚀 Instalação Rápida - ShopMy

## Passos para executar o projeto

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar banco de dados

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### 3. Configurar variáveis de ambiente

Crie o arquivo `.env.local` na raiz do projeto:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu-secret-key-aqui"

# Stripe (opcional para testes)
STRIPE_PUBLISHABLE_KEY="pk_test_sua_chave_publica"
STRIPE_SECRET_KEY="sk_test_sua_chave_secreta"
STRIPE_WEBHOOK_SECRET="whsec_seu_webhook_secret"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Executar o projeto

```bash
npm run dev
```

### 5. Acessar o projeto

- **Frontend**: http://localhost:3000
- **Admin**: http://localhost:3000/admin
- **Login Admin**: admin@shopmy.com / 123456

## 🎯 Funcionalidades Implementadas

✅ **Frontend Completo**

- Página inicial com produtos em destaque
- Catálogo de produtos com busca
- Página de detalhes do produto
- Carrinho de compras
- Sistema de checkout

✅ **Backend Completo**

- APIs REST para produtos e categorias
- Sistema de autenticação
- Integração com Stripe
- Webhooks para pagamentos

✅ **Painel Administrativo**

- Dashboard com estatísticas
- Gestão de produtos (CRUD)
- Controle de estoque
- Visualização de pedidos

✅ **Design Moderno**

- Interface responsiva
- Componentes reutilizáveis
- Animações suaves
- Design system consistente

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar em produção
npm start

# Banco de dados
npm run db:push      # Aplicar mudanças no schema
npm run db:studio    # Interface visual do banco
npm run db:seed      # Popular com dados de exemplo
```

## 📱 Testando o Sistema

1. **Como Usuário**:
   - Navegue pelos produtos
   - Adicione itens ao carrinho
   - Faça checkout (use cartão de teste do Stripe)

2. **Como Admin**:
   - Faça login com admin@shopmy.com / 123456
   - Acesse o painel administrativo
   - Gerencie produtos e categorias

## 🎨 Dados de Exemplo

O sistema já vem com:

- 3 categorias (Eletrônicos, Roupas, Casa)
- 8 produtos de exemplo
- 1 usuário administrador
- Imagens do Unsplash

## 🚀 Próximos Passos

- Configure o Stripe para pagamentos reais
- Personalize o design conforme sua marca
- Adicione mais funcionalidades conforme necessário
- Faça deploy em produção

---

**Pronto! Sua plataforma de e-commerce está funcionando! 🎉**
