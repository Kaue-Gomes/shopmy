# Configuração do ShopMy

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production

# Stripe
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Database
DATABASE_URL="file:./dev.db"

# Admin User (for demo)
ADMIN_EMAIL=admin@shopmy.com
ADMIN_PASSWORD=123456
```

## Credenciais de Acesso

### Usuário Administrador
- **Email**: admin@shopmy.com
- **Senha**: 123456

## Configuração do Stripe

1. Acesse [Stripe Dashboard](https://dashboard.stripe.com/)
2. Obtenha suas chaves de API
3. Configure o webhook para: `http://localhost:3000/api/webhooks/stripe`

## Problemas Conhecidos

### Erros 401
- Os erros 401 são normais quando não há autenticação
- A página de admin só funciona para usuários autenticados como ADMIN

### Warnings de Imagens
- As imagens agora têm a prop `sizes` configurada para melhor performance
- Os warnings foram corrigidos

### Content Script Errors
- Os erros de content script são de extensões do navegador
- Não afetam o funcionamento da aplicação
