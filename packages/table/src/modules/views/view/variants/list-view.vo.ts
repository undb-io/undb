import { Option, Some } from "@undb/domain"
import { z } from "@undb/zod"
import type { IDuplicateViewDTO } from "../../../../dto/duplicate-view.dto"
import { WithNewView, WithView } from "../../../../specifications/table-view.specification"
import type { TableDo } from "../../../../table.do"
import { ViewIdVo } from "../view-id.vo"
import { AbstractView, baseViewDTO, createBaseViewDTO, updateBaseViewDTO } from "./abstract-view.vo"

export const LIST_TYPE = "list" as const

export const createListViewDTO = createBaseViewDTO.extend({
  type: z.literal(LIST_TYPE),
})

export type ICreateListViewDTO = z.infer<typeof createListViewDTO>

export const listViewDTO = baseViewDTO.extend({
  type: z.literal(LIST_TYPE),
})

export type IListViewDTO = z.infer<typeof listViewDTO>

export const updateListViewDTO = updateBaseViewDTO.merge(
  z.object({
    type: z.literal(LIST_TYPE),
  }),
)

export type IUpdateListViewDTO = z.infer<typeof updateListViewDTO>

export class ListView extends AbstractView {
  constructor(table: TableDo, dto: IListViewDTO) {
    super(table, dto)
  }

  static create(table: TableDo, dto: ICreateListViewDTO) {
    const fields = table.getOrderedFields(undefined, undefined)
    return new ListView(table, {
      ...dto,
      id: ViewIdVo.fromStringOrCreate(dto.id).value,
      fields: fields.map((f, index) => ({ fieldId: f.id.value, hidden: index > 5 })),
    })
  }

  override type = LIST_TYPE

  override $update(table: TableDo, input: IUpdateListViewDTO): Option<WithView> {
    const json = this.toJSON()
    const view = new ListView(table, {
      ...json,
      name: input.name,
      id: this.id.value,
      type: LIST_TYPE,
    })

    return Some(new WithView(this, view))
  }

  override $duplicate(table: TableDo, dto: IDuplicateViewDTO): Option<WithNewView> {
    const json = this.toJSON()

    return Some(
      new WithNewView(
        new ListView(table, {
          ...json,
          name: dto.name,
          isDefault: false,
          id: ViewIdVo.create().value,
          type: LIST_TYPE,
        }),
      ),
    )
  }
}
