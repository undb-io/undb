import * as z from 'zod'

export const fieldIdSchema = z.string().min(1)
