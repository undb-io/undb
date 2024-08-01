import { inject } from "@undb/di"
import { z } from "@undb/zod"

export const MAIL_SERVICE = Symbol("MAIL_SERVICE")

export const injectMailService = () => inject(MAIL_SERVICE)

export const template = z.enum(["invite"])

export type Template = z.infer<typeof template>

export const sendInviteInput = z.object({
  template: z.literal("invite"),
  data: z.object({
    invite_sender_name: z.string(),
    email: z.string().email(),
    action_url: z.string().url(),
    help_url: z.string().url(),
  }),
})

export const sendInput = sendInviteInput.merge(
  z.object({
    subject: z.string(),
    from: z.string().optional(),
    to: z.string().email(),
  }),
)

export type ISendInput = z.infer<typeof sendInput>

export interface IMailService {
  send(input: ISendInput): Promise<void>
}
