import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  password: z.string().min(6).max(128),
})

export const checkoutBodySchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1).max(80),
        quantity: z.number().int().min(1).max(999),
      })
    )
    .min(1)
    .max(100),
  guestEmail: z.string().trim().email().optional(),
  guestName: z.string().trim().max(120).optional(),
})

export const checkoutGuestFormSchema = z
  .object({
    guestEmail: z.string(),
    guestName: z.string(),
  })
  .superRefine((data, ctx) => {
    const email = data.guestEmail.trim()
    const name = data.guestName.trim()

    const emailFmt = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Informe seu e-mail',
        path: ['guestEmail'],
      })
    } else if (!emailFmt.test(email)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'E-mail inválido',
        path: ['guestEmail'],
      })
    }

    if (name.length > 120) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Nome muito longo',
        path: ['guestName'],
      })
    }
  })

export const checkoutAuthenticatedFormSchema = z.object({
  guestEmail: z.string(),
  guestName: z.string(),
})

const nullableComparePrice = z.preprocess((v) => {
  if (v === '' || v === undefined) return undefined
  if (v === null) return null
  return v
}, z.union([z.null(), z.coerce.number().positive().finite()]))

const productCreateFieldsSchema = z.object({
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(10000),
  price: z.coerce.number().positive().finite(),
  compareAtPrice: nullableComparePrice.optional(),
  image: z.string().url().max(2048),
  stock: z.coerce.number().int().min(0),
  featured: z
    .preprocess((v) => {
      if (v === undefined || v === null) return false
      if (typeof v === 'boolean') return v
      if (typeof v === 'string') return v === 'true' || v === '1'
      return false
    }, z.boolean())
    .optional()
    .default(false),
  exclusive: z
    .preprocess((v) => {
      if (v === undefined || v === null) return false
      if (typeof v === 'boolean') return v
      if (typeof v === 'string') return v === 'true' || v === '1'
      return false
    }, z.boolean())
    .optional()
    .default(false),
  categoryId: z.string().min(1).max(80),
})

export const productCreateSchema = productCreateFieldsSchema.superRefine((data, ctx) => {
  if (
    data.compareAtPrice != null &&
    typeof data.compareAtPrice === 'number' &&
    data.compareAtPrice <= data.price
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'O preço anterior deve ser maior que o preço de venda',
      path: ['compareAtPrice'],
    })
  }
})

export const productUpdateSchema = productCreateFieldsSchema.partial().superRefine((data, ctx) => {
    if (
      data.price !== undefined &&
      data.compareAtPrice != null &&
      typeof data.compareAtPrice === 'number' &&
      data.compareAtPrice <= data.price
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'O preço anterior deve ser maior que o preço de venda',
        path: ['compareAtPrice'],
      })
    }
  })

export const categoryWriteSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(5000).nullable().optional(),
  image: z.union([z.string().url().max(2048), z.literal('')]).optional(),
})

export const categoryUpdateSchema = categoryWriteSchema.partial()

export const productsQuerySchema = z.object({
  featured: z.enum(['true', 'false']).optional(),
  category: z.string().min(1).max(80).optional(),
  search: z.string().trim().max(200).optional(),
  sort: z.enum(['newest', 'price_asc', 'price_desc', 'bestsellers']).optional(),
  page: z.coerce.number().int().min(1).max(10_000).optional().default(1),
  limit: z.coerce.number().int().min(1).max(48).optional().default(12),
})
