# ShopMy - Plataforma de E-commerce

Uma plataforma completa de e-commerce construída com React, Next.js e Stripe, incluindo sistema de pagamentos, gestão de produtos e painel administrativo.

## 🚀 Funcionalidades

- **Frontend Moderno**: Interface responsiva com React e Next.js
- **Sistema de Pagamentos**: Integração completa com Stripe
- **Gestão de Produtos**: CRUD completo para produtos e categorias
- **Painel Administrativo**: Dashboard para administradores
- **Carrinho de Compras**: Sistema de carrinho persistente
- **Autenticação**: Sistema de login com NextAuth.js
- **Banco de Dados**: Prisma ORM com SQLite
- **Design Responsivo**: Interface moderna com Tailwind CSS

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React, Next.js 14, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Next.js API Routes
- **Banco de Dados**: Prisma ORM, SQLite
- **Autenticação**: NextAuth.js
- **Pagamentos**: Stripe
- **Deploy**: Vercel (recomendado)

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Stripe (para pagamentos)

### Passos para Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd shopmy
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
Crie um arquivo `.env.local` na raiz do projeto:
```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu-secret-key-aqui"

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_test_sua_chave_publica_stripe"
STRIPE_SECRET_KEY="sk_test_sua_chave_secreta_stripe"
STRIPE_WEBHOOK_SECRET="whsec_seu_webhook_secret"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. **Configure o banco de dados**
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

5. **Execute o projeto**
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:3000`

## 🔧 Configuração do Stripe

1. Crie uma conta no [Stripe](https://stripe.com)
2. Obtenha suas chaves de API no dashboard do Stripe
3. Configure o webhook para `http://localhost:3000/api/webhooks/stripe`
4. Adicione as chaves no arquivo `.env.local`

## 👤 Usuários de Demonstração

### Administrador
- **Email**: admin@shopmy.com
- **Senha**: 123456
- **Acesso**: Painel administrativo completo

### Usuário Comum
- Crie uma conta através da página de cadastro
- Ou use qualquer email/senha (sistema de demonstração)

## 📱 Funcionalidades Principais

### Para Usuários
- ✅ Navegação por produtos e categorias
- ✅ Sistema de busca
- ✅ Carrinho de compras
- ✅ Checkout com Stripe
- ✅ Histórico de pedidos
- ✅ Perfil de usuário

### Para Administradores
- ✅ Dashboard com estatísticas
- ✅ Gestão de produtos (CRUD)
- ✅ Gestão de categorias
- ✅ Visualização de pedidos
- ✅ Controle de estoque

## 🎨 Design e UX

- Interface moderna e responsiva
- Componentes reutilizáveis
- Animações suaves
- Design system consistente
- Acessibilidade básica

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outras Plataformas

O projeto pode ser deployado em qualquer plataforma que suporte Next.js:
- Netlify
- Railway
- DigitalOcean
- AWS

## 📊 Estrutura do Projeto

```
shopmy/
├── app/                    # App Router do Next.js
│   ├── api/               # API Routes
│   ├── auth/              # Páginas de autenticação
│   ├── admin/             # Painel administrativo
│   └── products/          # Páginas de produtos
├── components/            # Componentes React
│   ├── ui/               # Componentes de UI base
│   └── ...               # Componentes específicos
├── lib/                  # Utilitários e configurações
├── prisma/               # Schema e migrations
├── types/                # Definições de tipos TypeScript
└── context/              # Contextos React
```

## 🔒 Segurança

- Autenticação com NextAuth.js
- Validação de dados com Zod
- Sanitização de inputs
- Proteção de rotas administrativas
- Webhooks seguros do Stripe

## 📈 Performance

- Server-side rendering (SSR)
- Static generation quando possível
- Otimização de imagens
- Lazy loading de componentes
- Cache de dados

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique a documentação
2. Procure por issues similares
3. Abra uma nova issue
4. Entre em contato

## 🎯 Próximos Passos

- [ ] Sistema de avaliações
- [ ] Cupons de desconto
- [ ] Notificações por email
- [ ] App mobile
- [ ] Integração com outros gateways
- [ ] Sistema de afiliados
- [ ] Analytics avançado

---

**Desenvolvido com ❤️ usando React, Next.js e Stripe**
