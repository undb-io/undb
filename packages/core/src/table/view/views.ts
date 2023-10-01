import { andOptions, ValueObject } from '@undb/domain'
import { Option } from 'oxide.ts'
import type { FieldId } from '../field/index.js'
import type { TableCompositeSpecification } from '../specifications/interface.js'
import type { WithTableView } from './specifications/views.specification.js'
import { WithNewView, WithoutView } from './specifications/views.specification.js'
import type { ICreateViewSchema } from './view.schema.js'
import type { ICreateViewInput_internal } from './view.type.js'
import { ViewVO } from './view.vo.js'

export class Views extends ValueObject<ViewVO[]> {
  get views() {
    return this.props
  }

  get ids() {
    return this.views.map((view) => view.id)
  }

  get defaultView(): Option<ViewVO> {
    return Option(this.views.at(0))
  }

  get count() {
    return this.views.length
  }

  addView(view: ViewVO) {
    this.views.push(view)
  }

  createView(input: ICreateViewSchema): WithTableView {
    const view = ViewVO.create(input)
    return new WithNewView(view)
  }

  duplicateView(id: string, name?: string): WithTableView {
    const view = this.getById(id)?.unwrap()
    const newView = view.duplicate({ name: name || view.name.value })
    return new WithNewView(newView)
  }

  removeView(id: string): WithoutView {
    const viewsCount = this.count
    if (viewsCount <= 1) {
      throw new Error('cannot remove last view')
    }
    const view = this.getById(id).unwrap()
    return new WithoutView(view)
  }

  removeField(id: FieldId): Option<TableCompositeSpecification> {
    const specs = this.views.map((view) => view.removeField(id))
    return andOptions(...specs)
  }

  static create(views: ICreateViewInput_internal[] = []): Views {
    return new this(views.map((v) => ViewVO.create(v)))
  }

  getById(viewId?: string): Option<ViewVO> {
    return Option(this.views.find((v) => v.id.value === viewId))
  }
}
