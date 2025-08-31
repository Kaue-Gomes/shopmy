'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui você pode implementar o envio do formulário
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Entre em Contato</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Informações de Contato */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações de Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                                 <div className="flex items-center gap-3">
                   <Mail className="h-5 w-5 text-blue-600" />
                   <div>
                     <p className="font-medium">Email</p>
                     <p className="text-gray-600">kauegomessales189@gmail.com</p>
                   </div>
                 </div>
                 
                 <div className="flex items-center gap-3">
                   <Phone className="h-5 w-5 text-blue-600" />
                   <div>
                     <p className="font-medium">Telefone</p>
                     <p className="text-gray-600">(88) 99709-0674</p>
                   </div>
                 </div>
                 
                 <div className="flex items-center gap-3">
                   <MapPin className="h-5 w-5 text-blue-600" />
                   <div>
                     <p className="font-medium">Endereço</p>
                     <p className="text-gray-600">
                       Fortaleza - CE<br />
                       Brasil
                     </p>
                   </div>
                 </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Horário de Funcionamento</p>
                    <p className="text-gray-600">
                      Segunda a Sexta: 9h às 18h<br />
                      Sábado: 9h às 14h
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Redes Sociais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    Facebook
                  </a>
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    Instagram
                  </a>
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    Twitter
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formulário de Contato */}
          <Card>
            <CardHeader>
              <CardTitle>Envie uma Mensagem</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Seu nome completo"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="seu@email.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="subject">Assunto</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Assunto da mensagem"
                  />
                </div>
                
                <div>
                  <Label htmlFor="message">Mensagem</Label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Sua mensagem aqui..."
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  Enviar Mensagem
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Rápido */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Perguntas Frequentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Como faço um pedido?</h3>
                <p className="text-gray-600 text-sm">
                  Basta navegar pelos produtos, adicionar ao carrinho e finalizar a compra.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Qual o prazo de entrega?</h3>
                <p className="text-gray-600 text-sm">
                  O prazo varia de 3 a 7 dias úteis, dependendo da sua localização.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Posso cancelar meu pedido?</h3>
                <p className="text-gray-600 text-sm">
                  Sim, você pode cancelar até 24h após a confirmação do pedido.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Quais formas de pagamento?</h3>
                <p className="text-gray-600 text-sm">
                  Aceitamos cartão de crédito, débito e PIX através do Stripe.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
