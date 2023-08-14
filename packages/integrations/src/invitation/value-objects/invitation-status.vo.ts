import { ValueObject } from '@undb/domain'
import { None, Some, type Option } from 'oxide.ts'
import { z } from 'zod'
import type { InvitationSpecification } from '../interface'
import { InvitationCancelled } from '../invitation.errors'
import { WithInvitationStatus } from '../specifications'

export const invitationStatus = z.enum(['pending', 'cancelled', 'accepted'])

export type IInvitationStatus = z.infer<typeof invitationStatus>

export class InvitationStatus extends ValueObject<IInvitationStatus> {
  public value() {
    return this.unpack()
  }

  public get isAccepted(): boolean {
    return this.unpack() === 'accepted'
  }

  public get isCancelled() {
    return this.unpack() === 'cancelled'
  }

  static fromString(status: string) {
    return new this({ value: invitationStatus.parse(status) })
  }

  public activate(): Option<InvitationSpecification> {
    if (this.unpack() === 'pending') {
      return None
    }
    const status = new InvitationStatus({ value: 'pending' })
    return Some(new WithInvitationStatus(status))
  }

  public cancel(): Option<InvitationSpecification> {
    if (this.unpack() === 'cancelled') {
      return None
    }
    const status = new InvitationStatus({ value: 'cancelled' })
    return Some(new WithInvitationStatus(status))
  }

  public accept(): Option<InvitationSpecification> {
    if (this.unpack() === 'accepted') {
      return None
    }

    if (this.isCancelled) {
      throw new InvitationCancelled()
    }

    const status = new InvitationStatus({ value: 'accepted' })
    return Some(new WithInvitationStatus(status))
  }

  public get acceptable(): boolean {
    return this.unpack() === 'pending'
  }
}
