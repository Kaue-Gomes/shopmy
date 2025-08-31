'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

interface FAQItemProps {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <Card className="mb-4">
      <CardHeader 
        className="cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <CardTitle className="flex items-center justify-between text-lg">
          {question}
          {isOpen ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </CardTitle>
      </CardHeader>
      {isOpen && (
        <CardContent>
          <p className="text-gray-600">{answer}</p>
        </CardContent>
      )}
    </Card>
  )
}

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const faqs = [
    {
      question: "Como faço para criar uma conta?",
      answer: "Clique em 'Cadastrar' no canto superior direito da página, preencha seus dados e confirme seu email. É rápido e gratuito!"
    },
    {
      question: "Quais formas de pagamento vocês aceitam?",
      answer: "Aceitamos cartão de crédito, débito e PIX através do Stripe, uma plataforma segura e confiável para processamento de pagamentos."
    },
    {
      question: "Qual o prazo de entrega dos produtos?",
      answer: "O prazo de entrega varia de 3 a 7 dias úteis, dependendo da sua localização. Você receberá um código de rastreamento por email."
    },
    {
      question: "Posso cancelar meu pedido?",
      answer: "Sim! Você pode cancelar seu pedido até 24 horas após a confirmação. Após esse período, o pedido já estará em processo de envio."
    },
    {
      question: "Como funciona a política de devolução?",
      answer: "Oferecemos 7 dias para devolução de produtos não utilizados. Entre em contato conosco através da página de contato para iniciar o processo."
    },
    {
      question: "Os produtos têm garantia?",
      answer: "Sim! Todos os nossos produtos têm garantia de 90 dias contra defeitos de fabricação. A garantia não cobre danos causados pelo uso inadequado."
    },
    {
      question: "Como acompanho meu pedido?",
      answer: "Após a confirmação do pagamento, você receberá um email com o código de rastreamento. Você também pode acompanhar na sua conta."
    },
    {
      question: "Vocês fazem entregas para todo o Brasil?",
      answer: "Sim! Entregamos para todo o território nacional. O frete é calculado automaticamente no checkout baseado no seu CEP."
    },
    {
      question: "Posso alterar o endereço de entrega?",
      answer: "Você pode alterar o endereço até 2 horas após a confirmação do pedido. Após esse período, entre em contato conosco."
    },
    {
      question: "Como entro em contato com o suporte?",
      answer: "Você pode entrar em contato através da nossa página de contato, email contato@shopmy.com ou telefone (11) 99999-9999."
    },
    {
      question: "Vocês têm programa de fidelidade?",
      answer: "Sim! Nossos clientes ganham pontos a cada compra que podem ser trocados por descontos em futuras compras."
    },
    {
      question: "Posso comprar produtos para revenda?",
      answer: "Sim! Oferecemos preços especiais para revendedores. Entre em contato conosco para mais informações sobre nosso programa de parceiros."
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Perguntas Frequentes</h1>
        
        <div className="mb-8">
          <p className="text-gray-600 text-center">
            Encontre respostas para as dúvidas mais comuns sobre nossos produtos e serviços.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openItems.includes(index)}
              onToggle={() => toggleItem(index)}
            />
          ))}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Não encontrou sua resposta?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Se você não encontrou a resposta para sua dúvida, nossa equipe de suporte 
              está pronta para ajudar!
            </p>
            <div className="flex gap-4">
              <a 
                href="/contact" 
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Entrar em Contato
              </a>
              <a 
                href="mailto:contato@shopmy.com" 
                className="border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition-colors"
              >
                Enviar Email
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
