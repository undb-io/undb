import { z } from "@undb/zod"

export const baseInput = z.object({
  subject: z.string(),
  from: z.string().optional(),
  to: z.string().email(),
})

export const sendInviteInput = z
  .object({
    template: z.literal("invite"),
    data: z.object({
      invite_sender_name: z.string(),
      space_name: z.string(),
      email: z.string().email(),
      action_url: z.string().url(),
      help_url: z.string().url(),
    }),
  })
  .merge(baseInput)

export const sendVerifyEmailInput = z
  .object({
    template: z.literal("verify-email"),
    data: z.object({
      username: z.string(),
      code: z.string(),
      action_url: z.string().url(),
    }),
  })
  .merge(baseInput)

export const resetPasswordEmailInput = z
  .object({
    template: z.literal("reset-password"),
    data: z.object({
      action_url: z.string().url(),
    }),
  })
  .merge(baseInput)

export const sendOtpInput = z
  .object({
    template: z.literal("otp"),
    data: z.object({
      otp: z.string(),
      action_url: z.string().url(),
      expires_in: z.number(),
      email: z.string().email(),
    }),
  })
  .merge(baseInput)

export const sendInput = z.discriminatedUnion("template", [
  sendInviteInput,
  sendVerifyEmailInput,
  resetPasswordEmailInput,
  sendOtpInput,
])

export type ISendInput = z.infer<typeof sendInput>
