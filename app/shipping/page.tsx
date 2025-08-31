import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Truck, Clock, MapPin, Shield, Package } from 'lucide-react'

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Informações de Envio</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Truck className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <h3 className="font-semibold mb-2">Entrega Rápida</h3>
              <p className="text-gray-600 text-sm">
                3 a 7 dias úteis para todo o Brasil
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Shield className="h-12 w-12 mx-auto text-green-600 mb-4" />
              <h3 className="font-semibold mb-2">Embalagem Segura</h3>
              <p className="text-gray-600 text-sm">
                Produtos protegidos durante o transporte
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Package className="h-12 w-12 mx-auto text-purple-600 mb-4" />
              <h3 className="font-semibold mb-2">Rastreamento</h3>
              <p className="text-gray-600 text-sm">
                Acompanhe seu pedido em tempo real
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Prazos de Entrega
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Regiões Metropolitanas</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• São Paulo: 2-3 dias úteis</li>
                  <li>• Rio de Janeiro: 3-4 dias úteis</li>
                  <li>• Belo Horizonte: 3-4 dias úteis</li>
                  <li>• Brasília: 3-4 dias úteis</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Interior e Outras Regiões</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• Sul: 4-5 dias úteis</li>
                  <li>• Nordeste: 5-6 dias úteis</li>
                  <li>• Norte: 6-7 dias úteis</li>
                  <li>• Centro-Oeste: 4-5 dias úteis</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Cobertura de Entrega
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Entregamos para todo o território nacional, incluindo:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-1 text-gray-600">
                <li>• Todas as capitais</li>
                <li>• Cidades do interior</li>
                <li>• Zonas rurais</li>
                <li>• Regiões metropolitanas</li>
              </ul>
              <ul className="space-y-1 text-gray-600">
                <li>• Ilhas e arquipélagos</li>
                <li>• Áreas de difícil acesso</li>
                <li>• Zonas de fronteira</li>
                <li>• Territórios especiais</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Política de Frete</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Frete Grátis</h3>
                <p className="text-gray-600">
                  Para compras acima de R$ 150,00, o frete é grátis para todo o Brasil.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Cálculo do Frete</h3>
                <p className="text-gray-600">
                  O valor do frete é calculado automaticamente no checkout baseado no seu CEP, 
                  peso e dimensões dos produtos.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Formas de Pagamento do Frete</h3>
                <p className="text-gray-600">
                  O frete pode ser pago junto com o produto ou separadamente, 
                  dependendo da transportadora escolhida.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Rastreamento de Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600">
                Após a confirmação do pagamento, você receberá:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• Email de confirmação com código de rastreamento</li>
                <li>• Atualizações por SMS (opcional)</li>
                <li>• Acesso ao rastreamento na sua conta</li>
                <li>• Notificação quando o produto sair para entrega</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Problemas com a Entrega</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Produto não entregue</h3>
                <p className="text-gray-600">
                  Se o produto não foi entregue no prazo, entre em contato conosco. 
                  Investigaremos e resolveremos o problema.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Produto danificado</h3>
                <p className="text-gray-600">
                  Se o produto chegou danificado, tire fotos e entre em contato imediatamente. 
                  Faremos a troca sem custos.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Endereço incorreto</h3>
                <p className="text-gray-600">
                  Se você informou o endereço errado, entre em contato o mais rápido possível. 
                  Podemos redirecionar a entrega.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contato</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Para dúvidas sobre envio e entrega, entre em contato conosco:
            </p>
            <div className="space-y-2 text-gray-600">
              <p>📧 Email: contato@shopmy.com</p>
              <p>📞 Telefone: (11) 99999-9999</p>
              <p>💬 Chat online: Disponível 24/7</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
