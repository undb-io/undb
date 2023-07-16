import { z } from 'zod'
import { shareIdSchema } from './share-id.vo.js'
import { shareTargetSchema } from './share-target.vo.js'

export const queryShare = z
  .object({
    id: shareIdSchema,
    target: shareTargetSchema.nullable(),
    enabled: z.boolean(),
  })
  .strict()

export const unsafeCreateShareSchema = z.object({
  id: shareIdSchema,
  target: shareTargetSchema.nullable(),
  enabled: z.boolean(),
})

export const createShareSchema = z.object({
  id: shareIdSchema.optional(),
  target: shareTargetSchema.nullable().default({ id: '', type: 'view' }),
  enabled: z.boolean().default(true),
})

export type ICreateShareSchema = z.infer<typeof createShareSchema>

export const updateShareSchema = z
  .object({
    enabled: z.boolean(),
  })
  .partial()

export type IUpdateShareSchema = z.infer<typeof updateShareSchema>
