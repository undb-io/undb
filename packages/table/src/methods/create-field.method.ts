import { Some, type Option } from "@undb/domain"
import { FieldCreatedEvent } from "../events"
import { type ICreateFieldDTO } from "../modules"
import type { TableComositeSpecification } from "../specifications"
import type { TableDo } from "../table.do"

export function createFieldMethod(this: TableDo, dto: ICreateFieldDTO): Option<TableComositeSpecification> {
  const spec = this.schema.$createField(dto)

  spec.mutate(this)

  const event = new FieldCreatedEvent({
    tableId: this.id.value,
    field: spec.field.toJSON(),
  })
  this.addDomainEvent(event)

  return Some(spec)
}
