import { Option, Some } from "@undb/domain"
import { z } from "@undb/zod"
import type { IUpdateViewDTO } from "../../../../dto"
import { WithView } from "../../../../specifications/table-view.specification"
import { ViewIdVo } from "../view-id.vo"
import { AbstractView, baseViewDTO, createBaseViewDTO } from "./abstract-view.vo"

export const GRID_TYPE = "grid" as const

export const createGridViewDTO = createBaseViewDTO.extend({
  type: z.literal(GRID_TYPE),
})

export type ICreateGridViewDTO = z.infer<typeof createGridViewDTO>

export const gridViewDTO = baseViewDTO.extend({
  type: z.literal(GRID_TYPE),
})

export type IGridViewDTO = z.infer<typeof gridViewDTO>

export class GridView extends AbstractView {
  constructor(dto: IGridViewDTO) {
    super(dto)
  }

  static create(dto: ICreateGridViewDTO) {
    return new GridView({ ...dto, id: ViewIdVo.fromStringOrCreate(dto.id).value })
  }

  override type = GRID_TYPE

  override $update(input: IUpdateViewDTO): Option<WithView> {
    const json = this.toJSON()
    const view = new GridView({ ...json, name: input.name, id: this.id.value })

    return Some(new WithView(this, view))
  }
}
