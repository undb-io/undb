import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ISubject } from '../../common/index.js'
import { Subject, Subjects } from '../../common/index.js'
import type { IRLSVisitor } from '../interface.js'
import type { RLS } from '../rls.js'

export class WithRLSSubjects extends CompositeSpecification<RLS, IRLSVisitor> {
  constructor(public readonly subjects: Subjects) {
    super()
  }

  static from(subjects: ISubject[]) {
    return new this(new Subjects(subjects.map((subject) => new Subject(subject))))
  }
  isSatisfiedBy(t: RLS): boolean {
    return t.subjects.equals(this.subjects)
  }
  mutate(t: RLS): Result<RLS, string> {
    t.subjects = this.subjects
    return Ok(t)
  }
  accept(v: IRLSVisitor): Result<void, string> {
    v.withRLSSubjects(this)
    return Ok(undefined)
  }
}

export class RLSSubjectContainsUser extends CompositeSpecification<RLS, IRLSVisitor> {
  constructor(public readonly userId: string) {
    super()
  }
  isSatisfiedBy(t: RLS): boolean {
    if (!t.subjects.users.length) return true
    return t.subjects.users.some((user) => user.value.id === this.userId)
  }
  mutate(t: RLS): Result<RLS, string> {
    throw new Error('Method not implemented.')
  }
  accept(v: IRLSVisitor): Result<void, string> {
    v.subjectContainsUser(this)
    return Ok(undefined)
  }
}
