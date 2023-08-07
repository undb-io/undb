import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ICollaboratorProfile } from '../../field/fields/collaborator/collaborator-field.type.js'
import type { Record } from '../record.js'
import type { IRecordVisitor } from './interface.js'

export class WithRecordUpdatedBy extends CompositeSpecification<Record, IRecordVisitor> {
  constructor(public readonly userId: string) {
    super()
  }

  static fromString(user: string): WithRecordUpdatedBy {
    return new this(user)
  }

  isSatisfiedBy(t: Record): boolean {
    return this.userId === t.updatedBy
  }

  mutate(r: Record): Result<Record, string> {
    r.updatedBy = this.userId
    return Ok(r)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.updatedBy(this)
    return Ok(undefined)
  }
}
export class UdpatedByIn extends CompositeSpecification<Record, IRecordVisitor> {
  constructor(public readonly userIds: string[]) {
    super()
  }

  isSatisfiedBy(t: Record): boolean {
    return this.userIds.includes(t.updatedBy)
  }

  mutate(r: Record): Result<Record, string> {
    throw new Error('Method not implemeted')
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.updatedByIn(this)
    return Ok(undefined)
  }
}

export class WithRecordUpdatedByProfile extends CompositeSpecification<Record, IRecordVisitor> {
  constructor(public readonly profile: ICollaboratorProfile | null) {
    super()
  }

  isSatisfiedBy(t: Record): boolean {
    throw new Error('not implemented')
  }

  mutate(r: Record): Result<Record, string> {
    r.updatedByProfile = this.profile
    return Ok(r)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    return Ok(undefined)
  }
}
