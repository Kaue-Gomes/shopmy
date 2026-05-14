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

export const productCreateSchema = z.object({
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(10000),
  price: z.coerce.number().positive().finite(),
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
  categoryId: z.string().min(1).max(80),
})

export const productUpdateSchema = productCreateSchema.partial()

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
  sort: z.enum(['newest', 'price_asc', 'price_desc']).optional(),
  page: z.coerce.number().int().min(1).max(10_000).optional().default(1),
  limit: z.coerce.number().int().min(1).max(48).optional().default(12),
})
