import { z } from "@undb/zod"
import { tableId } from "../../../table-id.vo"
import { widgetDTO } from "../../widgets/widget.vo"
import {
  createCalendarViewDTO,
  createGridViewDTO,
  createListViewDTO,
  viewAggregate,
  viewColorGroup,
  viewFields,
  viewFilterGroup,
  viewOption,
  viewSort,
} from "../view"
import { createGalleryViewDTO } from "../view/variants/gallery-view.vo"
import { createKanbanViewDTO } from "../view/variants/kanban-view.vo"
import { createPivotViewDTO } from "../view/variants/pivot-view.vo"
import { viewId } from "../view/view-id.vo"
import { viewName } from "../view/view-name.vo"
import { viewType } from "../view/view.type"

export const createBaseViewDTO = z.object({
  id: viewId.optional(),
  name: viewName,
  type: viewType,

  option: viewOption.optional(),
  filter: viewFilterGroup.optional(),
  color: viewColorGroup.optional(),
  sort: viewSort.optional(),
  fields: viewFields.optional(),
  aggregate: viewAggregate.optional(),
  widgets: widgetDTO.array().optional(),
})

export const createViewDTO = z.discriminatedUnion("type", [
  createGridViewDTO,
  createKanbanViewDTO,
  createGalleryViewDTO,
  createListViewDTO,
  createCalendarViewDTO,
  createPivotViewDTO,
])

export const createViewsDTO = z.array(createViewDTO).refine(
  (views) => {
    const viewsWithId = views.filter((view) => !!view.id)
    const ids = viewsWithId.map((view) => view.id)
    return new Set(ids).size === ids.length
  },
  { message: "view ids must be unique" },
)

export const createViewWithoutNameDTO = z.discriminatedUnion("type", [
  createGridViewDTO.omit({ name: true }),
  createKanbanViewDTO.omit({ name: true }),
  createGalleryViewDTO.omit({ name: true }),
  createListViewDTO.omit({ name: true }),
  createCalendarViewDTO.omit({ name: true }),
  createPivotViewDTO.omit({ name: true }),
])

export const createViewsWithoutNameDTO = z.array(createViewWithoutNameDTO).refine(
  (views) => {
    const viewsWithId = views.filter((view) => !!view.id)
    const ids = viewsWithId.map((view) => view.id)
    return new Set(ids).size === ids.length
  },
  { message: "view ids must be unique" },
)

export type ICreateViewDTO = z.infer<typeof createViewDTO>

export const createTableViewDTO = z.discriminatedUnion("type", [
  createGridViewDTO.merge(z.object({ tableId })),
  createKanbanViewDTO.merge(z.object({ tableId })),
  createGalleryViewDTO.merge(z.object({ tableId })),
  createListViewDTO.merge(z.object({ tableId })),
  createCalendarViewDTO.merge(z.object({ tableId })),
  createPivotViewDTO.merge(z.object({ tableId })),
])

export type ICreateTableViewDTO = z.infer<typeof createTableViewDTO>
