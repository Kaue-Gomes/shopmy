import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Termos de Uso</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>1. Aceitação dos Termos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Ao acessar e usar o ShopMy, você concorda em cumprir e estar vinculado aos 
              termos e condições de uso estabelecidos nesta página.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>2. Uso da Plataforma</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Você concorda em usar nossa plataforma apenas para fins legais e de acordo com estes termos. 
              É proibido:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Usar a plataforma para atividades ilegais</li>
              <li>Tentar acessar contas de outros usuários</li>
              <li>Interferir no funcionamento da plataforma</li>
              <li>Fazer upload de conteúdo malicioso</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>3. Contas de Usuário</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Você é responsável por manter a confidencialidade de sua conta e senha. 
              Todas as atividades que ocorrem sob sua conta são de sua responsabilidade.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>4. Produtos e Preços</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Reservamo-nos o direito de:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Alterar preços a qualquer momento</li>
              <li>Limitar a quantidade de produtos por pedido</li>
              <li>Recusar ou cancelar pedidos</li>
              <li>Descontinuar produtos</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>5. Pagamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Os pagamentos são processados de forma segura através do Stripe. 
              Todos os preços incluem impostos aplicáveis. Não oferecemos reembolsos 
              exceto conforme nossa política de devolução.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>6. Propriedade Intelectual</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Todo o conteúdo da plataforma, incluindo textos, gráficos, logotipos, 
              imagens e software, é propriedade do ShopMy e está protegido por leis de direitos autorais.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>7. Limitação de Responsabilidade</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              O ShopMy não será responsável por danos diretos, indiretos, incidentais, 
              especiais ou consequenciais resultantes do uso ou incapacidade de usar nossa plataforma.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>8. Modificações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Reservamo-nos o direito de modificar estes termos a qualquer momento. 
              As alterações entrarão em vigor imediatamente após a publicação.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>9. Contato</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Para dúvidas sobre estes termos, entre em contato conosco através da nossa 
              <a href="/contact" className="text-blue-600 hover:underline"> página de contato</a>.
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
