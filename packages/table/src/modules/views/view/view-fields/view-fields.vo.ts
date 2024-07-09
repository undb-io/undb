import { ValueObject } from "@undb/domain"
import { z } from "@undb/zod"
import { isEqual } from "radash"
import type { TableDo } from "../../../../table.do"
import { fieldId, type Field } from "../../../schema"

export const viewField = z.object({
  fieldId,
  hidden: z.boolean(),
})

export const viewFields = viewField.array()

export type IViewFields = z.infer<typeof viewFields>

export class ViewFields extends ValueObject<IViewFields> {
  constructor(props: IViewFields) {
    super(props)
  }

  static default(table: TableDo): ViewFields {
    return new ViewFields(
      table.schema.fields.map((field) => ({
        fieldId: field.id.value,
        hidden: false,
      })),
    )
  }

  public isEqual(sort: IViewFields): boolean {
    return isEqual(sort, this.props)
  }

  public toJSON(): IViewFields {
    return [...this.props]
  }

  public fieldIds(): Set<string> {
    return this.props.reduce((acc, { fieldId }) => acc.add(fieldId), new Set<string>())
  }

  public getVisibleFields(): string[] {
    return this.props.filter(({ hidden }) => !hidden).map(({ fieldId }) => fieldId)
  }

  public getVisibleFieldsCount(): number {
    return this.getVisibleFields().length
  }

  public getHiddenFields(): string[] {
    return this.props.filter(({ hidden }) => hidden).map(({ fieldId }) => fieldId)
  }

  public getHiddenFieldsCount(): number {
    return this.getHiddenFields().length
  }

  public addField(field: Field): ViewFields {
    return new ViewFields([...this.props, { fieldId: field.id.value, hidden: false }])
  }
}
