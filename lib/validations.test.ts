import { describe, expect, it } from 'vitest'
import { registerSchema, productsQuerySchema, checkoutBodySchema } from '@/lib/validations'

describe('schemas', () => {
  it('rejeita registro incompleto', () => {
    expect(registerSchema.safeParse({}).success).toBe(false)
  })

  it('produtos aceita query válida', () => {
    const parsed = productsQuerySchema.safeParse({ page: '2', sort: 'price_asc', limit: '12' })
    expect(parsed.success).toBe(true)
    if (parsed.success) expect(parsed.data.page).toBe(2)
  })

  it('checkout aceita lista de itens', () => {
    const parsed = checkoutBodySchema.safeParse({
      items: [{ productId: 'abcde123456789abcdef', quantity: 1 }],
    })
    expect(parsed.success).toBe(true)
  })
})
