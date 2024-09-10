import { match } from "ts-pattern"
import type { ICreateViewDTO } from "../dto/create-view.dto"
import type { IViewDTO } from "./dto/view.dto"
import { GalleryView } from "./variants/gallery-view.vo"
import { GridView } from "./variants/grid-view.vo"
import { KanbanView } from "./variants/kanban-view.vo"

export class ViewFactory {
  static create(dto: ICreateViewDTO) {
    return match(dto)
      .with({ type: "grid" }, (dto) => GridView.create(dto))
      .with({ type: "kanban" }, (dto) => KanbanView.create(dto))
      .with({ type: "gallery" }, (dto) => GalleryView.create(dto))
      .exhaustive()
  }

  static fromJSON(dto: IViewDTO) {
    return match(dto)
      .with({ type: "grid" }, (dto) => new GridView(dto))
      .with({ type: "kanban" }, (dto) => new KanbanView(dto))
      .with({ type: "gallery" }, (dto) => new GalleryView(dto))
      .exhaustive()
  }
}
