import type { User } from '@undb/core'
import { colorsSchema } from '@undb/core'
import { ValueObject, emailSchema } from '@undb/domain'
import { z } from 'zod'

export const memberUserProfile = z.object({
  email: emailSchema,
  username: z.string(),
  color: colorsSchema,
  avatar: z.string().nullable(),
})

export type IMemberUserProfile = z.infer<typeof memberUserProfile>

export class MemberUserProfile extends ValueObject<IMemberUserProfile> {
  public static fromUser(user: User) {
    return new this({
      email: user.email,
      username: user.username,
      color: user.color,
      avatar: user.avatar ?? null,
    })
  }

  public get profile() {
    return this.props
  }
}
