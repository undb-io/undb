import { and, ValueObject } from '@egodb/domain'
import { Option } from 'oxide.ts'
import type { Field } from '../field'
import { WithViewFieldsOrder } from '../specifications'
import type { TableCompositeSpecificaiton } from '../specifications/interface'
import { View } from './view'
import type { ICreateViewInput_internal } from './view.type'

export class Views extends ValueObject<View[]> {
  get views() {
    return this.props
  }

  get defaultView(): Option<View> {
    return Option(this.views.at(0))
  }

  addView(view: View) {
    this.views.push(view)
  }

  addField(field: Field): Option<TableCompositeSpecificaiton> {
    const specs = this.views
      .filter((view) => !!view.fieldsOrder)
      .map((v) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const viewFieldsOrder = v.fieldsOrder!.add(field.name.value)
        return new WithViewFieldsOrder(viewFieldsOrder, v)
      })

    return and(...specs)
  }

  static create(views: ICreateViewInput_internal[] = []): Views {
    return new this(views.map((v) => View.create(v)))
  }

  getById(viewId?: string): Option<View> {
    return Option(this.views.find((v) => v.id.value === viewId))
  }
}
