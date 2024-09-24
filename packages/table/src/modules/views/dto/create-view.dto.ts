import { z } from "@undb/zod"
import { tableId } from "../../../table-id.vo"
import { viewColorGroup, viewFields, viewFilterGroup, viewOption, viewSort } from "../view"
import { galleryOption } from "../view/variants/gallery-view.vo"
import { kanbanOption } from "../view/variants/kanban-view.vo"
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
})

export const createGridViewDTO = createBaseViewDTO.extend({
  type: z.literal("grid"),
})

export const createKanbanViewDTO = createBaseViewDTO.extend({
  type: z.literal("kanban"),
  kanban: kanbanOption.optional(),
})

export const createGalleryViewDTO = createBaseViewDTO.extend({
  type: z.literal("gallery"),
  gallery: galleryOption.optional(),
})

export const createViewDTO = z.discriminatedUnion("type", [
  createGridViewDTO,
  createKanbanViewDTO,
  createGalleryViewDTO,
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
])

export type ICreateTableViewDTO = z.infer<typeof createTableViewDTO>
