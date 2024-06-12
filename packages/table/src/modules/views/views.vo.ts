import { Option, ValueObject } from "@undb/domain"
import type { IViewsDTO } from "./dto"
import { GridView } from "./view/variants/grid-view.vo"
import type { ViewId } from "./view/view-id.vo"
import type { View } from "./view/view.type"

export class Views extends ValueObject {
  constructor(public readonly views: View[]) {
    super(views)
  }

  static create() {
    return new Views([GridView.create({ name: "Grid View", type: "grid", isDefault: true })])
  }

  toJSON(): IViewsDTO {
    return this.views.map((view) => view.toJSON())
  }

  static fromJSON(dto: IViewsDTO) {
    const views = dto.map((view) => new GridView(view))
    return new this(views)
  }

  addView(view: View) {
    return new Views([...this.views, view])
  }

  getViewById(id?: ViewId): View {
    let view: View | undefined
    if (!id) {
      view = this.views.at(0)
    } else {
      view = this.views.find((view) => view.id.equals(id)) ?? this.views.at(0)
    }
    return Option(view).expect("View not found")
  }
}
