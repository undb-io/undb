import { None, Option, Some } from "@undb/domain"
import { z } from "@undb/zod"
import type { IDuplicateViewDTO } from "../../../../dto/duplicate-view.dto"
import { WithNewView, WithView } from "../../../../specifications/table-view.specification"
import type { TableDo } from "../../../../table.do"
import { fieldId } from "../../../schema/fields/field-id.vo"
import type { Field } from "../../../schema/fields/field.type"
import { ViewIdVo } from "../view-id.vo"
import { AbstractView, baseViewDTO, createBaseViewDTO, updateBaseViewDTO } from "./abstract-view.vo"

export const PIVOT_TYPE = "pivot" as const

export const PIVOT_AGGREGATE = ["sum", "count", "average", "max", "min"] as const
export const DEFAULT_PIVOT_AGGREGATE = "sum"

export type IPivotAggregate = (typeof PIVOT_AGGREGATE)[number]

export const pivotAggregateSchema = z.enum(PIVOT_AGGREGATE)

export const pivotOption = z.object({
  columnLabel: fieldId.optional(),
  rowLabel: fieldId.optional(),
  value: fieldId.optional(),
  aggregate: pivotAggregateSchema.optional(),
})

export type IPivotOption = z.infer<typeof pivotOption>

export const createPivotViewDTO = createBaseViewDTO.extend({
  type: z.literal(PIVOT_TYPE),
  pivot: pivotOption.optional(),
})

export type ICreatePivotViewDTO = z.infer<typeof createPivotViewDTO>

export const pivotViewDTO = baseViewDTO.extend({
  type: z.literal(PIVOT_TYPE),
  pivot: pivotOption.optional(),
})

export type IPivotViewDTO = z.infer<typeof pivotViewDTO>

export const updatePivotViewDTO = updateBaseViewDTO.merge(
  z.object({
    type: z.literal(PIVOT_TYPE),
    pivot: pivotOption.optional(),
  }),
)

export type IUpdatePivotViewDTO = z.infer<typeof updatePivotViewDTO>

export class PivotView extends AbstractView {
  pivot: Option<IPivotOption> = None

  get columnLabel() {
    return this.pivot.map((x) => x.columnLabel)
  }

  get rowLabel() {
    return this.pivot.map((x) => x.rowLabel)
  }

  get value() {
    return this.pivot.map((x) => x.value)
  }

  get pivotAggregate() {
    return this.pivot.map((x) => x.aggregate)
  }

  get isValid() {
    const pivotAggregate = this.pivotAggregate.into(undefined)
    if (pivotAggregate === "count") {
      return (
        this.columnLabel.isSome() && !!this.columnLabel.unwrap() && this.rowLabel.isSome() && !!this.rowLabel.unwrap()
      )
    }

    return (
      this.columnLabel.isSome() &&
      !!this.columnLabel.unwrap() &&
      this.rowLabel.isSome() &&
      !!this.rowLabel.unwrap() &&
      this.value.isSome() &&
      !!this.value.unwrap() &&
      this.pivotAggregate.isSome() &&
      !!this.pivotAggregate.unwrap()
    )
  }

  constructor(table: TableDo, dto: IPivotViewDTO) {
    super(table, dto)
    this.pivot = Option(dto.pivot)
  }

  static create(table: TableDo, dto: ICreatePivotViewDTO) {
    const fields = table.getOrderedFields()
    const columnFields = table.schema.getPivotFields("column", fields)
    const rowFields = table.schema.getPivotFields("row", fields)
    const valueFields = table.schema.getPivotValueFields("sum", fields)

    return new PivotView(table, {
      ...dto,
      id: ViewIdVo.fromStringOrCreate(dto.id).value,
      fields: fields.map((f, index) => ({ fieldId: f.id.value, hidden: index > 5 })),
      pivot: {
        columnLabel: columnFields.at(0)?.id.value,
        rowLabel: rowFields.at(0)?.id.value,
        value: valueFields.at(0)?.id.value,
        aggregate: DEFAULT_PIVOT_AGGREGATE,
      },
    })
  }

  override type = PIVOT_TYPE

  override $update(table: TableDo, input: IUpdatePivotViewDTO): Option<WithView> {
    const json = this.toJSON()
    const view = new PivotView(table, {
      ...json,
      name: input.name,
      id: this.id.value,
      type: PIVOT_TYPE,
      pivot: input.pivot ?? this.pivot.into(undefined),
    })

    return Some(new WithView(this, view))
  }

  override $duplicate(table: TableDo, dto: IDuplicateViewDTO): Option<WithNewView> {
    const json = this.toJSON()

    return Some(
      new WithNewView(
        new PivotView(table, {
          ...json,
          name: dto.name,
          pivot: this.pivot.into(undefined),
          isDefault: false,
          id: ViewIdVo.create().value,
          type: PIVOT_TYPE,
        }),
      ),
    )
  }

  toJSON() {
    return { ...super.toJSON(), pivot: this.pivot.into(undefined) }
  }
}

export function isValidColumnLabel(field: Field) {
  return field.type === "select" && field.isSingle
}

export function isValidRowLabel(field: Field) {
  return (
    field.type === "string" || (field.type === "select" && field.isSingle) || (field.type === "user" && field.isSingle)
  )
}

export function isValidValueField(aggregate: IPivotAggregate, field: Field) {
  if (aggregate === "count") {
    return true
  }
  return field.type === "number" || field.type === "percentage" || field.type === "currency" || field.type === "rating"
}
