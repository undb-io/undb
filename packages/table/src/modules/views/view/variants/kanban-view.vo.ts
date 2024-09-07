import { None, Option, Some } from "@undb/domain"
import { z } from "@undb/zod"
import { WithNewView, WithView } from "../../../../specifications/table-view.specification"
import { fieldId } from "../../../schema"
import { ViewIdVo } from "../view-id.vo"
import { AbstractView, baseViewDTO, createBaseViewDTO, updateBaseViewDTO } from "./abstract-view.vo"

export const KANBAN_TYPE = "kanban" as const

export const kanbanOption = z.object({
  field: fieldId.optional(),
})

export type IKanbanOption = z.infer<typeof kanbanOption>

export const createKanbanViewDTO = createBaseViewDTO.extend({
  type: z.literal(KANBAN_TYPE),
  kanban: kanbanOption.optional(),
})

export type ICreateKanbanViewDTO = z.infer<typeof createKanbanViewDTO>

export const kanbanViewDTO = baseViewDTO.extend({
  type: z.literal(KANBAN_TYPE),
  kanban: kanbanOption.optional(),
})

export type IKanbanViewDTO = z.infer<typeof kanbanViewDTO>

export const updateKanbanViewDTO = updateBaseViewDTO.merge(
  z.object({
    type: z.literal(KANBAN_TYPE),
    kanban: kanbanOption.optional(),
  }),
)

export type IUpdateKanbanViewDTO = z.infer<typeof updateKanbanViewDTO>

export class KanbanView extends AbstractView {
  kanban: Option<IKanbanOption> = None

  get field() {
    return this.kanban.map((x) => x.field)
  }

  constructor(dto: IKanbanViewDTO) {
    super(dto)
    this.kanban = Option(dto.kanban)
  }

  static create(dto: ICreateKanbanViewDTO) {
    return new KanbanView({ ...dto, id: ViewIdVo.fromStringOrCreate(dto.id).value })
  }

  override type = KANBAN_TYPE

  override $update(input: IUpdateKanbanViewDTO): Option<WithView> {
    const json = this.toJSON()
    const view = new KanbanView({
      ...json,
      name: input.name,
      id: this.id.value,
      type: KANBAN_TYPE,
      kanban: input.kanban,
    })

    return Some(new WithView(this, view))
  }

  override $duplicate(): Option<WithNewView> {
    const json = this.toJSON()

    return Some(
      new WithNewView(
        new KanbanView({
          ...json,
          kanban: this.kanban.into(undefined),
          isDefault: false,
          id: ViewIdVo.create().value,
          type: KANBAN_TYPE,
        }),
      ),
    )
  }

  toJSON() {
    return { ...super.toJSON(), kanban: this.kanban.into(undefined) }
  }
}
