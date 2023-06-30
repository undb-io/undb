import type { z } from 'zod'
import type { queryShare, unsafeCreateShareSchema } from './share.schema.js'

export type IQueryShare = z.infer<typeof queryShare>

export type IUnsafeCreateShare = z.infer<typeof unsafeCreateShareSchema>
