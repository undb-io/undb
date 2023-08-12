import { ValueObject } from '@undb/domain'
import { z } from 'zod'
import { WithInvitationStatus } from '../specifications'

export const invitationStatus = z.enum(['active', 'cancelled'])

export type IInvitationStatus = z.infer<typeof invitationStatus>

export class InvitationStatus extends ValueObject<IInvitationStatus> {
  public value() {
    return this.props.value
  }

  static fromString(status: string) {
    return new this({ value: invitationStatus.parse(status) })
  }

  public activate() {
    const status = new InvitationStatus({ value: 'active' })
    return new WithInvitationStatus(status)
  }

  public cancel() {
    const status = new InvitationStatus({ value: 'cancelled' })
    return new WithInvitationStatus(status)
  }
}
