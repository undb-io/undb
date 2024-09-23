import { ValueObject } from "@undb/domain"
import { z } from "@undb/zod"
import { isEmpty } from "radash"
import type { TableDo } from "../../../../table.do"
import { fieldId } from "../../../schema/fields/field-id.vo"
import { fieldAggregate, type IFieldAggregate } from "../../../schema/fields/field.aggregate"

export const viewAggregate = z.record(fieldId, fieldAggregate)

export type IViewAggregate = z.infer<typeof viewAggregate>

export class ViewAggregateVO extends ValueObject<IViewAggregate> {
  static create(table: TableDo, dto: IViewAggregate) {
    const parsed: IViewAggregate = {}
    for (const [fieldId, fieldAggregate] of Object.entries(dto)) {
      const field = table.schema.fieldMapById.get(fieldId)
      if (!field) {
        continue
      }

      parsed[fieldId] = field.aggregate.parse(fieldAggregate) as IFieldAggregate
    }
    return new ViewAggregateVO(parsed)
  }

  public toJSON() {
    return { ...this.value }
  }

  public isEmpty() {
    return isEmpty(this.value)
  }

  *[Symbol.iterator]() {
    yield* Object.entries(this.value)
  }
}
