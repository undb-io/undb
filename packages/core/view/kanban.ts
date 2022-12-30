import { ValueObject } from '@egodb/domain'
import type { IKanban } from './kanban.type'

export class Kanban extends ValueObject<IKanban> {
  public get selectField() {
    return this.props.selectField
  }
}
