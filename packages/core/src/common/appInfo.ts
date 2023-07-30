import { z } from 'zod'

const AppInfoSchema = z.object({
  version: z.string(),
})

export type IAppInfo = z.infer<typeof AppInfoSchema>
