import { ValueObject } from '@undb/domain'
import type { Subject } from './subject.vo.js'

export class Subjects extends ValueObject<Subject[]> {
  public get subjects() {
    return this.props
  }

  public get users() {
    return this.subjects.filter((subject) => subject.isUser)
  }
}
