import { OrderVO } from '@undb/domain'
import type { Option } from 'oxide.ts'
import { z } from 'zod'
import { WithViewsOrder } from './specifications/index.js'
import type { ViewVO } from './view.vo.js'

export const viewsOrderSchema = z.string().array()

export class ViewsOrder extends OrderVO {
  static fromArray(ids: string[]): ViewsOrder {
    return new this(ids)
  }

  public unpack(): string[] {
    return this.props
  }

  static empty(): ViewsOrder {
    return new this([])
  }

  public get last() {
    return this.props[this.props.length - 1]
  }

  public addView(view: ViewVO): WithViewsOrder {
    const order = this.add(view.id.value)
    const vo = new ViewsOrder(order.order)
    return new WithViewsOrder(vo)
  }

  public removeView(view: ViewVO): Option<WithViewsOrder> {
    const order = this.remove(view.id.value)
    return order.map((order) => {
      const vo = new ViewsOrder(order.order)
      return new WithViewsOrder(vo)
    })
  }
}
