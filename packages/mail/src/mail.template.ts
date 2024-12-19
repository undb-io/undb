import { z } from "@undb/zod"

export const template = z.enum(["invite", "reset-password", "verify-email", "otp"])

export type Template = z.infer<typeof template>
