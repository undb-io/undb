import { Option, ValueObject } from "@undb/domain"
import type { IViewsDTO } from "./dto"
import { GridView } from "./view/variants/grid-view.vo"
import { ViewIdVo } from "./view/view-id.vo"
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

  getViewById(id: string | undefined): View {
    let view: View | undefined
    if (!id) {
      view = this.views.at(0)
    } else {
      const viewId = new ViewIdVo(id)
      view = this.views.find((view) => view.id.equals(viewId)) ?? this.views.at(0)
    }
    return Option(view).expect("View not found")
  }

  getDefaultView() {
    return this.views.find((view) => view.isDefault) ?? this.views.at(0)!
  }

  getNoneDefaultViews() {
    return this.views.filter((view) => !view.isDefault)
  }

  update(view: View) {
    return new Views(this.views.map((v) => (v.id.equals(view.id) ? view : v)))
  }

  deleteView(view: View) {
    return new Views(this.views.filter((v) => !v.id.equals(view.id)))
  }
}
