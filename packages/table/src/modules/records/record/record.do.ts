import { AggregateRoot, type Option } from "@undb/domain"
import type { TableDo } from "../../../table.do"
import type { FieldValue } from "../../schema"
import type { FieldId } from "../../schema/fields/field-id.vo"
import { RecordCreatedEvent, type IRecordEvent } from "../events"
import type { ICreateRecordDTO } from "./dto"
import { RecordIdVO, type RecordId } from "./record-id.vo"
import { RecordValuesVO } from "./record-values.vo"
import type { RecordComositeSpecification } from "./record.composite-specification"

export class RecordDO extends AggregateRoot<IRecordEvent> {
  constructor(
    readonly id: RecordId,
    readonly values: RecordValuesVO,
  ) {
    super()
  }

  static create(table: TableDo, dto: ICreateRecordDTO) {
    const record = new RecordDO(RecordIdVO.create(dto.id), RecordValuesVO.create(table, dto.values))

    const event = new RecordCreatedEvent(table, record)
    record.addDomainEvent(event)

    return record
  }

  public flatten() {
    return {
      id: this.id.value,
      ...this.values.toJSON(),
    }
  }

  getValue(fieldId: FieldId): Option<FieldValue> {
    return this.values.getValue(fieldId)
  }

  match(spec: RecordComositeSpecification): boolean {
    return spec.isSatisfiedBy(this)
  }
}

export type IRecordDO = InstanceType<typeof RecordDO>
