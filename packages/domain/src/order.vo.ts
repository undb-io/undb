import { arrayMoveImmutable } from 'array-move'
import { None, Option, Some } from 'oxide.ts'
import { ValueObject } from './value-object.js'

export class OrderVO extends ValueObject<string[]> {
  public get order() {
    return this.props
  }

  static empty(): OrderVO {
    return new this([])
  }

  static fromArray(ids: string[]): OrderVO {
    return new this(ids)
  }

  public move(fromId: string, toId: string): OrderVO {
    const fromIndex = this.order.findIndex((id) => id === fromId)
    const toIndex = this.order.findIndex((id) => id === toId)

    const moved = arrayMoveImmutable(this.order, fromIndex, toIndex)
    return OrderVO.fromArray(moved)
  }

  public add(id: string): OrderVO {
    return OrderVO.fromArray([...this.props, id])
  }

  public addAfter(id: string, after?: string): OrderVO {
    if (!after) return this.add(id)

    const order = this.props.flatMap((item) => (item === after ? [after, id] : item))
    return OrderVO.fromArray(order)
  }

  public remove(id: string): Option<OrderVO> {
    if (this.order.includes(id)) {
      return Some(new OrderVO(this.order.filter((_id) => _id !== id)))
    }

    return None
  }

  public toJSON() {
    return this.props
  }
}
