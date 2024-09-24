import { None, Option, Some } from "@undb/domain"
import { z } from "@undb/zod"
import type { IDuplicateViewDTO } from "../../../../dto"
import { WithNewView, WithView, WithViewFieldWidth } from "../../../../specifications/table-view.specification"
import type { TableDo } from "../../../../table.do"
import { FieldIdVo } from "../../../schema/fields/field-id.vo"
import { ViewIdVo } from "../view-id.vo"
import { AbstractView, baseViewDTO, createBaseViewDTO, updateBaseViewDTO } from "./abstract-view.vo"

export const GRID_TYPE = "grid" as const

export const gridOption = z.object({
  widths: z.record(z.number().positive()),
})

export type IGridOption = z.infer<typeof gridOption>

export const createGridViewDTO = createBaseViewDTO.extend({
  type: z.literal(GRID_TYPE),
  grid: gridOption.optional(),
})

export type ICreateGridViewDTO = z.infer<typeof createGridViewDTO>

export const gridViewDTO = baseViewDTO.extend({
  type: z.literal(GRID_TYPE),
  grid: gridOption.optional(),
})

export type IGridViewDTO = z.infer<typeof gridViewDTO>

export const updateGridViewDTO = updateBaseViewDTO.merge(
  z.object({
    type: z.literal(GRID_TYPE),
    grid: gridOption.optional(),
  }),
)

export type IUpdateGridViewDTO = z.infer<typeof updateGridViewDTO>

export class GridView extends AbstractView {
  grid: Option<IGridOption> = None
  constructor(table: TableDo, dto: IGridViewDTO) {
    super(table, dto)
    this.grid = Option(dto.grid)
  }

  static create(table: TableDo, dto: ICreateGridViewDTO) {
    return new GridView(table, { ...dto, id: ViewIdVo.fromStringOrCreate(dto.id).value })
  }

  getFieldWidth(fieldId: string) {
    return this.grid.into(undefined)?.widths?.[fieldId] ?? 200
  }

  setFieldWidth(fieldId: string, width: number) {
    this.grid = Some({
      ...this.grid.into(undefined),
      widths: {
        ...this.grid.into(undefined)?.widths,
        [fieldId]: width,
      },
    })
  }

  $setFieldWidthSpec(fieldId: string, width: number): Option<WithViewFieldWidth> {
    const previous = this.grid.into(undefined)?.widths?.[fieldId]
    if (previous === width) {
      return None
    }

    return Some(new WithViewFieldWidth(this.id, new FieldIdVo(fieldId), width))
  }

  override type = GRID_TYPE

  override $update(table: TableDo, input: IUpdateGridViewDTO): Option<WithView> {
    const json = this.toJSON()
    const view = new GridView(table, {
      ...json,
      name: input.name,
      id: this.id.value,
      type: GRID_TYPE,
      grid: input.grid ?? this.grid.into(undefined),
    })

    return Some(new WithView(this, view))
  }

  override $duplicate(table: TableDo, dto: IDuplicateViewDTO): Option<WithNewView> {
    const json = this.toJSON()

    return Some(
      new WithNewView(
        new GridView(table, {
          ...json,
          name: dto.name,
          isDefault: false,
          id: ViewIdVo.create().value,
          type: GRID_TYPE,
          grid: this.grid.into(undefined),
        }),
      ),
    )
  }

  override toJSON(): IGridViewDTO {
    return {
      ...super.toJSON(),
      type: GRID_TYPE,
      grid: this.grid.into(undefined),
    }
  }
}
