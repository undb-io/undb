import { ValueObject } from "@undb/domain"
import { z } from "@undb/zod"
import type { TableDo } from "../../../../table.do"
import { fieldId } from "../../../schema"
import { fieldAggregate } from "../../../schema/fields/field.aggregate"

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

      parsed[fieldId] = field.aggregates.parse(fieldAggregate)
    }
    return new ViewAggregateVO(parsed)
  }
}
