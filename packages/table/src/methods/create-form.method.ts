import { Some, type Option } from "@undb/domain"
import { type ICreateFormDTO } from "../modules"
import type { TableComositeSpecification } from "../specifications"
import type { TableDo } from "../table.do"

export function createFormMethod(this: TableDo, dto: ICreateFormDTO): Option<TableComositeSpecification> {
  throw new Error("Not implemented")
  // const spec = this.schema.$createForm(dto)

  // spec.mutate(this)

  // const event = new FormCreatedEvent({
  //   tableId: this.id.value,
  //   field: spec.field.toJSON(),
  // })
  // this.addDomainEvent(event)

  // return Some(spec)
}
