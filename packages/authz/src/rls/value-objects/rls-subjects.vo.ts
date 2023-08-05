import { ValueObject } from '@undb/domain'
import type { RLSSubject } from './rls-subject.vo.js'

export class RLSSubjects extends ValueObject<RLSSubject[]> {
  public get subjects() {
    return this.props
  }
}
