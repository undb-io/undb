import { match } from "ts-pattern"
import type { TableDo } from "../../../table.do"
import type { ICreateViewDTO } from "../dto/create-view.dto"
import type { IViewDTO } from "./dto/view.dto"
import { CalendarView } from "./variants/calendar-view.vo"
import { GalleryView } from "./variants/gallery-view.vo"
import { GridView } from "./variants/grid-view.vo"
import { KanbanView } from "./variants/kanban-view.vo"
import { ListView } from "./variants/list-view.vo"
import { PivotView } from "./variants/pivot-view.vo"

export class ViewFactory {
  static create(table: TableDo, dto: ICreateViewDTO) {
    return match(dto)
      .with({ type: "grid" }, (dto) => GridView.create(table, dto))
      .with({ type: "kanban" }, (dto) => KanbanView.create(table, dto))
      .with({ type: "gallery" }, (dto) => GalleryView.create(table, dto))
      .with({ type: "list" }, (dto) => ListView.create(table, dto))
      .with({ type: "calendar" }, (dto) => CalendarView.create(table, dto))
      .with({ type: "pivot" }, (dto) => PivotView.create(table, dto))
      .exhaustive()
  }

  static fromJSON(table: TableDo, dto: IViewDTO) {
    return match(dto)
      .with({ type: "grid" }, (dto) => new GridView(table, dto))
      .with({ type: "kanban" }, (dto) => new KanbanView(table, dto))
      .with({ type: "gallery" }, (dto) => new GalleryView(table, dto))
      .with({ type: "list" }, (dto) => new ListView(table, dto))
      .with({ type: "calendar" }, (dto) => new CalendarView(table, dto))
      .with({ type: "pivot" }, (dto) => new PivotView(table, dto))
      .exhaustive()
  }
}
