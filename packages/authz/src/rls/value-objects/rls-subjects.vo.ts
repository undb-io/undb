import { ValueObject } from '@undb/domain'
import type { RLSSubject } from './rls-subject.vo.js'

export class RLSSubjects extends ValueObject<RLSSubject[]> {
  public get subjects() {
    return this.props
  }

  public get users() {
    return this.subjects.filter((subject) => subject.isUser)
  }
}
