import { z } from 'zod'
import { shareIdSchema } from './share-id.vo.js'
import { shareTargetSchema } from './share-target.vo.js'

export const queryShare = z
  .object({
    id: shareIdSchema,
    target: shareTargetSchema,
    enabled: z.boolean(),
  })
  .strict()

export const unsafeCreateShareSchema = z.object({
  id: shareIdSchema,
  target: shareTargetSchema,
  enabled: z.boolean(),
})

export const createShareSchema = z.object({
  id: shareIdSchema.optional(),
  target: shareTargetSchema.default({ id: '', type: 'view' }),
  enabled: z.boolean().default(true),
})

export type ICreateShareSchema = z.infer<typeof createShareSchema>

export const updateShareSchema = z.object({}).partial()

export type IUpdateShareSchema = z.infer<typeof updateShareSchema>
