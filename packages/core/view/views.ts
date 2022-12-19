import { ValueObject } from '@egodb/domain'
import { Option } from 'oxide.ts'
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

  static create(views: ICreateViewInput_internal[] = []): Views {
    return new this(views.map((v) => View.create(v)))
  }

  getByName(viewName?: string): Option<View> {
    return Option(this.views.find((v) => v.name.unpack() === viewName))
  }
}
