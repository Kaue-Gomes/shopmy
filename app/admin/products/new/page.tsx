'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save, Upload } from 'lucide-react'
import Link from 'next/link'
import type { Category } from '@prisma/client'
import { toast } from 'sonner'

export default function NewProductPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [uploadBusy, setUploadBusy] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    compareAtPrice: '',
    image: '',
    stock: '',
    featured: false,
    exclusive: false,
    categoryId: '',
  })

  useEffect(() => {
    ;(async () => {
      const res = await fetch('/api/categories')
      if (res.ok) setCategories(await res.json())
    })()
  }, [])

  useEffect(() => {
    if (status === 'loading') return
    if (session?.user?.role !== 'ADMIN') {
      router.replace('/')
    }
  }, [status, session, router])

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-muted-foreground">Carregando…</p>
      </div>
    )
  }

  if (session?.user?.role !== 'ADMIN') {
    return null
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const fd = new FormData()
    fd.append('file', file)

    setUploadBusy(true)
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast.error(data.error || 'Falha no upload')
        return
      }
      if (typeof data.url === 'string') {
        setFormData((prev) => ({ ...prev, image: data.url }))
        toast.success('Imagem enviada ao Blob')
      }
    } finally {
      setUploadBusy(false)
      e.target.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          compareAtPrice:
            formData.compareAtPrice.trim() === '' ? undefined : Number(formData.compareAtPrice),
          image: formData.image,
          stock: Number(formData.stock),
          featured: formData.featured,
          exclusive: formData.exclusive,
          categoryId: formData.categoryId,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (response.ok) {
        toast.success('Produto criado')
        router.push('/admin')
      } else {
        toast.error(data.error || 'Não foi possível criar produto')
      }
    } catch {
      toast.error('Erro de rede')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin">
            <Button variant="outline" size="icon" type="button">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Novo produto</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Criar produto</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Nome do produto"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Descrição"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Estoque</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="compareAtPrice">
                  Preço “de” (opcional, maior que o preço de venda)
                </Label>
                <Input
                  id="compareAtPrice"
                  name="compareAtPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.compareAtPrice}
                  onChange={handleChange}
                  placeholder="Ex.: 99,90"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="image">URL da imagem</Label>
                <Input
                  id="image"
                  name="image"
                  type="url"
                  value={formData.image}
                  onChange={handleChange}
                  required
                  placeholder="https://…"
                  className="font-mono text-sm"
                />
                <div className="flex items-center gap-2">
                  <input
                    id="imgblob"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    aria-hidden
                    onChange={handleImageUpload}
                  />
                  <Label
                    htmlFor="imgblob"
                    className="inline-flex cursor-pointer items-center rounded-md border border-input px-3 py-2 text-sm hover:bg-muted"
                  >
                    <Upload className="mr-2 h-4 w-4" aria-hidden />
                    {uploadBusy ? 'Enviando…' : 'Upload (Vercel Blob)'}
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    Requer <code className="rounded bg-muted px-1">BLOB_READ_WRITE_TOKEN</code> no
                    servidor
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoryId">Categoria</Label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Selecione</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="exclusive"
                  name="exclusive"
                  checked={formData.exclusive}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-input text-primary accent-primary"
                />
                <Label htmlFor="exclusive">Produto exclusivo (badge roxa)</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-input text-primary accent-primary"
                />
                <Label htmlFor="featured">Destaque na home</Label>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Salvando…' : 'Salvar produto'}
                </Button>
                <Link href="/admin">
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
