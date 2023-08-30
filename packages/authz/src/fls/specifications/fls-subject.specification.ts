import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ISubject } from '../../common/index.js'
import { Subject, Subjects } from '../../common/index.js'
import type { FLS } from '../fls.js'
import type { IFLSVisitor } from '../interface.js'

export class WithFLSSubjects extends CompositeSpecification<FLS, IFLSVisitor> {
  constructor(public readonly subjects: Subjects) {
    super()
  }

  static from(subjects: ISubject[]) {
    return new this(new Subjects(subjects.map((subject) => new Subject(subject))))
  }
  isSatisfiedBy(t: FLS): boolean {
    return t.subjects.equals(this.subjects)
  }
  mutate(t: FLS): Result<FLS, string> {
    t.subjects = this.subjects
    return Ok(t)
  }
  accept(v: IFLSVisitor): Result<void, string> {
    v.withFLSSubjects(this)
    return Ok(undefined)
  }
}

export class FLSSubjectContainsUser extends CompositeSpecification<FLS, IFLSVisitor> {
  constructor(public readonly userId: string) {
    super()
  }
  isSatisfiedBy(t: FLS): boolean {
    if (!t.subjects.users.length) return true
    return t.subjects.users.some((user) => user.value.id === this.userId)
  }
  mutate(t: FLS): Result<FLS, string> {
    throw new Error('Method not implemented.')
  }
  accept(v: IFLSVisitor): Result<void, string> {
    v.subjectContainsUser(this)
    return Ok(undefined)
  }
}

export const isFLSUserMatch = (userId: string) => new FLSSubjectContainsUser(userId)
