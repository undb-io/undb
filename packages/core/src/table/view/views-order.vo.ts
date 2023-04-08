import { OrderVO } from '@undb/domain'
import type { Option } from 'oxide.ts'
import { z } from 'zod'
import { WithViewsOrder } from './specifications/index.js'
import type { View } from './view.js'

export const viewsOrderSchema = z.string().array()

export class ViewsOrder extends OrderVO {
  static fromArray(ids: string[]): ViewsOrder {
    return new this(ids)
  }
  static empty(): ViewsOrder {
    return new this([])
  }

  public addView(view: View): WithViewsOrder {
    const order = this.add(view.id.value)
    const vo = new ViewsOrder(order.order)
    return new WithViewsOrder(vo)
  }

  public removeView(view: View): Option<WithViewsOrder> {
    const order = this.remove(view.id.value)
    return order.map((order) => {
      const vo = new ViewsOrder(order.order)
      return new WithViewsOrder(vo)
    })
  }
}
