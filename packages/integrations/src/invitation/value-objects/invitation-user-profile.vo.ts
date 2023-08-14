import type { User } from '@undb/core'
import { ValueObject } from '@undb/domain'
import { z } from 'zod'

export const invitationUserProfile = z.object({
  username: z.string(),
})

export type IInvitationUserProfile = z.infer<typeof invitationUserProfile>

export class InvitationUserProfile extends ValueObject<IInvitationUserProfile> {
  static fromUser(user: User) {
    return new this({ username: user.username })
  }

  public get profile() {
    return this.props
  }
}
