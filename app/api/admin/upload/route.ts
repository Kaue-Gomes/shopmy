import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { getAdminSessionOrNull } from '@/lib/require-admin'

const ALLOWED_TYPES = /^image\/(jpeg|jpg|png|webp|gif)$/
const MAX_SIZE = 5 * 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    const adminSession = await getAdminSessionOrNull()
    if (!adminSession?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        {
          error:
            'Upload não configurado. Defina BLOB_READ_WRITE_TOKEN (Vercel Blob) nas variáveis de ambiente.',
        },
        { status: 503 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'Arquivo obrigatório' }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Arquivo muito grande (máx. 5 MB)' }, { status: 400 })
    }

    const type = file.type
    if (!ALLOWED_TYPES.test(type)) {
      return NextResponse.json({ error: 'Tipo de arquivo não permitido' }, { status: 400 })
    }

    const extension = type.split('/')[1]?.replace('jpeg', 'jpg') || 'bin'
    const filename = `products/${adminSession.user.id}/${Date.now()}.${extension}`

    const blob = await put(filename, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json({ error: 'Erro ao enviar arquivo' }, { status: 500 })
  }
}
