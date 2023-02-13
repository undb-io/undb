import { ValueObject } from '@egodb/domain'
import { arrayMoveImmutable } from 'array-move'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import type { Field } from '../field/index.js'

export class ViewFieldsOrder extends ValueObject<string[]> {
  public get order() {
    return this.props
  }

  static fromArray(ids: string[]): ViewFieldsOrder {
    return new this(ids)
  }

  public move(fromId: string, toId: string): ViewFieldsOrder {
    const fromIndex = this.order.findIndex((id) => id === fromId)
    const toIndex = this.order.findIndex((id) => id === toId)

    const moved = arrayMoveImmutable(this.order, fromIndex, toIndex)
    return ViewFieldsOrder.fromArray(moved)
  }

  public add(name: string): ViewFieldsOrder {
    return ViewFieldsOrder.fromArray([...this.props, name])
  }

  public removeField(field: Field): Option<ViewFieldsOrder> {
    if (this.order.includes(field.id.value)) {
      return Some(new ViewFieldsOrder(this.order.filter((id) => id !== field.id.value)))
    }

    return None
  }
}
