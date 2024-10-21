import { and, andOptions, None, Option, ValueObject } from "@undb/domain"
import type { ISetDefaultViewDTO } from "../../dto/set-default-view.dto"
import { WithView, type TableComositeSpecification } from "../../specifications"
import type { TableDo } from "../../table.do"
import type { Field } from "../schema"
import type { ICreateViewDTO, IViewsDTO } from "./dto"
import { GridView } from "./view/variants/grid-view.vo"
import { ViewIdVo } from "./view/view-id.vo"
import type {
  ICreateViewWidgetDTO,
  IDeleteViewWidgetDTO,
  IDuplicateViewWidgetDTO,
  IUpdateViewWidgetDTO,
} from "./view/view-widget/view-widget.dto"
import { ViewFactory } from "./view/view.factory"
import type { View } from "./view/view.type"

export class Views extends ValueObject {
  constructor(public readonly views: View[]) {
    super(views)
  }

  static create(table: TableDo, views?: ICreateViewDTO[]) {
    if (views?.length) {
      let vs = new Views([])
      const vsDTO = views.map((view) => ViewFactory.create(table, view))

      for (const view of vsDTO) {
        vs = vs.addView(table, view)
      }

      return vs
    }
    return new Views([GridView.create(table, { name: "default", type: "grid", isDefault: true })])
  }

  toJSON(): IViewsDTO {
    return this.views.map((view) => view.toJSON())
  }

  static fromJSON(table: TableDo, dto: IViewsDTO) {
    const views = dto.map((view) => ViewFactory.fromJSON(table, view))
    return new this(views)
  }

  addView(table: TableDo, view: View) {
    if (!this.views.length) {
      const json = view.toJSON()
      const defaultView = ViewFactory.fromJSON(table, { ...json, isDefault: true })
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
      view = this.getDefaultView()
    } else {
      const viewId = new ViewIdVo(id)
      view = this.views.find((view) => view.id.equals(viewId)) ?? this.getDefaultView()
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

  $addField(table: TableDo, field: Field) {
    const specs = this.views.map((view) => view.$addField(table, field))

    return andOptions(...specs)
  }

  $createWidget(table: TableDo, dto: ICreateViewWidgetDTO): Option<TableComositeSpecification> {
    const view = this.getViewById(dto.viewId)
    const spec = view.$createWidgetSpec(dto.widget)

    if (spec.isSome()) {
      spec.unwrap().mutate(table)
    }

    return spec
  }

  $duplicateWidget(table: TableDo, dto: IDuplicateViewWidgetDTO): Option<TableComositeSpecification> {
    const view = this.getViewById(dto.viewId)
    const spec = view.$duplicateWidgetSpec(dto.widgetId)

    if (spec.isSome()) {
      spec.unwrap().mutate(table)
    }

    return spec
  }

  $updateWidget(table: TableDo, dto: IUpdateViewWidgetDTO): Option<TableComositeSpecification> {
    const view = this.getViewById(dto.viewId)
    const spec = view.$updateWidgetSpec(dto.widget)

    if (spec.isSome()) {
      spec.unwrap().mutate(table)
    }

    return spec
  }

  $deleteWidget(table: TableDo, dto: IDeleteViewWidgetDTO): Option<TableComositeSpecification> {
    const view = this.getViewById(dto.viewId)
    const spec = view.$deleteWidgetSpec(dto.id)

    if (spec.isSome()) {
      spec.unwrap().mutate(table)
    }

    return spec
  }

  $deleteField(table: TableDo, field: Field) {
    const specs = this.views.map((view) => view.$deleteField(table, field))

    return andOptions(...specs)
  }

  $setDefaultView(table: TableDo, dto: ISetDefaultViewDTO): Option<TableComositeSpecification> {
    const defaultView = this.getDefaultView()
    if (defaultView.id.value === dto.viewId) {
      return None
    }

    const view = this.getViewById(dto.viewId)

    const defaultViewSpec = new WithView(
      ViewFactory.fromJSON(table, defaultView.toJSON()),
      ViewFactory.fromJSON(table, { ...defaultView.toJSON(), isDefault: false }),
    )

    const viewSpec = new WithView(
      ViewFactory.fromJSON(table, view.toJSON()),
      ViewFactory.fromJSON(table, { ...view.toJSON(), isDefault: true }),
    )

    return and(defaultViewSpec, viewSpec)
  }
}
