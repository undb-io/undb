import * as z from 'zod'

export const fieldNameSchema = z.string().trim().min(1)
