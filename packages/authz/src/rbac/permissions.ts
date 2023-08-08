import { z } from 'zod'

export const tablePermissions = z.enum(['table:create', 'table:export'])

export type Permission = z.infer<typeof tablePermissions>
