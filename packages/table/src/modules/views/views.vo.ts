import { and, andOptions, None, Option, ValueObject } from "@undb/domain"
import type { ISetDefaultViewDTO } from "../../dto/set-default-view.dto"
import { WithView, type TableComositeSpecification } from "../../specifications"
import type { Field } from "../schema"
import type { ICreateViewDTO, IViewsDTO } from "./dto"
import { GridView } from "./view/variants/grid-view.vo"
import { ViewIdVo } from "./view/view-id.vo"
import { ViewFactory } from "./view/view.factory"
import type { View } from "./view/view.type"

export class Views extends ValueObject {
  constructor(public readonly views: View[]) {
    super(views)
  }

  static create(views?: ICreateViewDTO[]) {
    if (views?.length) {
      let vs = new Views([])
      const vsDTO = views.map((view) => ViewFactory.create(view))

      for (const view of vsDTO) {
        vs = vs.addView(view)
      }

      return vs
    }
    return new Views([GridView.create({ name: "default", type: "grid", isDefault: true })])
  }

  toJSON(): IViewsDTO {
    return this.views.map((view) => view.toJSON())
  }

  static fromJSON(dto: IViewsDTO) {
    const views = dto.map((view) => ViewFactory.fromJSON(view))
    return new this(views)
  }

  addView(view: View) {
    if (!this.views.length) {
      const json = view.toJSON()
      const defaultView = ViewFactory.fromJSON({ ...json, isDefault: true })
      return new Views([defaultView])
    }
    return new Views([...this.views, view])
  }

  getViewByNameOrId(name: string | undefined, id: string | undefined): View {
    if (name) {
      return this.getViewByName(name) ?? this.getDefaultView()
    }
    return this.getViewById(id)
  }

  getViewByName(name: string): View | undefined {
    return this.views.find((view) => view.name.value === name)
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

  $addField(field: Field) {
    const specs = this.views.map((view) => view.$addField(field))

    return andOptions(...specs)
  }

  $deleteField(field: Field) {
    const specs = this.views.map((view) => view.$deleteField(field))

    return andOptions(...specs)
  }

  $setDefaultView(dto: ISetDefaultViewDTO): Option<TableComositeSpecification> {
    const defaultView = this.getDefaultView()
    if (defaultView.id.value === dto.viewId) {
      return None
    }

    const view = this.getViewById(dto.viewId)

    const defaultViewSpec = new WithView(
      ViewFactory.fromJSON(defaultView.toJSON()),
      ViewFactory.fromJSON({ ...defaultView.toJSON(), isDefault: false }),
    )

    const viewSpec = new WithView(
      ViewFactory.fromJSON(view.toJSON()),
      ViewFactory.fromJSON({ ...view.toJSON(), isDefault: true }),
    )

    return and(defaultViewSpec, viewSpec)
  }
}
