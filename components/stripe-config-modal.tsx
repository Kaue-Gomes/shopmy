'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react'

interface StripeConfigModalProps {
  isOpen: boolean
  onClose: () => void
}

export function StripeConfigModal({ isOpen, onClose }: StripeConfigModalProps) {
  const [copied, setCopied] = useState<string | null>(null)

  if (!isOpen) return null

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const envContent = `# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Database
DATABASE_URL="file:./dev.db"`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-orange-500" />
            Configuração do Stripe Necessária
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-orange-800">
              Para finalizar compras, você precisa configurar as chaves da API do Stripe. 
              Siga os passos abaixo para configurar o sistema de pagamentos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Passo 1: Obter Chaves do Stripe
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Acesse o <a href="https://dashboard.stripe.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Stripe Dashboard</a></li>
                  <li>Faça login ou crie uma conta</li>
                  <li>Vá em "Developers" → "API keys"</li>
                  <li>Copie a "Publishable key" e "Secret key"</li>
                  <li>Para webhook, vá em "Webhooks" → "Add endpoint"</li>
                  <li>URL: <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:3000/api/webhooks/stripe</code></li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Passo 2: Configurar Variáveis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Crie um arquivo <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code> na raiz do projeto:
                </p>
                <div className="relative">
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">
                    <code>{envContent}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(envContent, 'env')}
                  >
                    {copied === 'env' ? 'Copiado!' : 'Copiar'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Passo 3: Reiniciar o Servidor</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Após configurar as variáveis de ambiente, reinicie o servidor de desenvolvimento:
              </p>
              <div className="relative">
                <pre className="bg-gray-900 text-white p-4 rounded-lg text-sm">
                  <code>npm run dev</code>
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard('npm run dev', 'restart')}
                >
                  {copied === 'restart' ? 'Copiado!' : 'Copiar'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">💡 Dica</h3>
            <p className="text-blue-700 text-sm">
              Use as chaves de teste (que começam com <code>pk_test_</code> e <code>sk_test_</code>) 
              para desenvolvimento. Em produção, use as chaves ao vivo.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Entendi
            </Button>
            <Button onClick={onClose}>
              Configurar Agora
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
