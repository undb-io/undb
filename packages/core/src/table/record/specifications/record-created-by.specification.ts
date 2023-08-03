import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ICollaboratorProfile } from '../../field/fields/collaborator/collaborator-field.type.js'
import type { Record } from '../record.js'
import type { IRecordVisitor } from './interface.js'

export class WithRecordCreatedBy extends CompositeSpecification<Record, IRecordVisitor> {
  constructor(public readonly user: string) {
    super()
  }

  static fromString(user: string): WithRecordCreatedBy {
    return new this(user)
  }

  isSatisfiedBy(t: Record): boolean {
    return this.user === t.createdBy
  }

  mutate(r: Record): Result<Record, string> {
    r.createdBy = this.user
    return Ok(r)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.createdBy(this)
    return Ok(undefined)
  }
}

export class CreatedByIn extends CompositeSpecification<Record, IRecordVisitor> {
  constructor(public readonly userIds: string[]) {
    super()
  }

  isSatisfiedBy(t: Record): boolean {
    return this.userIds.includes(t.createdBy)
  }

  mutate(r: Record): Result<Record, string> {
    throw new Error('Method not implemeted')
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.createdByIn(this)
    return Ok(undefined)
  }
}

export class WithRecordCreatedByProfile extends CompositeSpecification<Record, IRecordVisitor> {
  constructor(public readonly profile: ICollaboratorProfile | null) {
    super()
  }

  isSatisfiedBy(t: Record): boolean {
    throw new Error('not implemented')
  }

  mutate(r: Record): Result<Record, string> {
    r.createdByProfile = this.profile
    return Ok(r)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    return Ok(undefined)
  }
}
