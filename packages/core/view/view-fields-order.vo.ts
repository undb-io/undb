import { ValueObject } from '@egodb/domain'
import arrayMove from 'array-move'

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

    const moved = arrayMove(this.order, fromIndex, toIndex)
    return ViewFieldsOrder.fromArray(moved)
  }
}
