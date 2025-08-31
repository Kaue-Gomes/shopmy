import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Política de Privacidade</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>1. Informações que Coletamos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Coletamos informações que você nos fornece diretamente, como quando você:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Cria uma conta em nossa plataforma</li>
              <li>Faz uma compra</li>
              <li>Entra em contato conosco</li>
              <li>Se inscreve em nossa newsletter</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>2. Como Usamos suas Informações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Utilizamos suas informações para:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Processar e entregar seus pedidos</li>
              <li>Comunicar sobre seu pedido e conta</li>
              <li>Melhorar nossos produtos e serviços</li>
              <li>Enviar ofertas e promoções (com seu consentimento)</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>3. Compartilhamento de Informações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, 
              exceto quando necessário para processar pagamentos ou cumprir obrigações legais.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>4. Segurança</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Implementamos medidas de segurança adequadas para proteger suas informações 
              contra acesso não autorizado, alteração, divulgação ou destruição.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>5. Seus Direitos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Você tem o direito de:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Acessar suas informações pessoais</li>
              <li>Corrigir informações incorretas</li>
              <li>Solicitar a exclusão de seus dados</li>
              <li>Retirar seu consentimento a qualquer momento</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>6. Contato</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco 
              através da nossa <a href="/contact" className="text-blue-600 hover:underline">página de contato</a>.
            </p>
          </CardContent>
        </Card>

        <div className="mt-8 text-sm text-gray-500">
          <p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      </div>
    </div>
  )
}
