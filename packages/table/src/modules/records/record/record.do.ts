import { AggregateRoot, andOptions, type Option } from "@undb/domain"
import type { TableDo } from "../../../table.do"
import type { FieldValue } from "../../schema"
import { FieldIdVo, type FieldId } from "../../schema/fields/field-id.vo"
import { FieldValueFactory } from "../../schema/fields/field-value.factory"
import { RecordCreatedEvent, type IRecordEvent } from "../events"
import type { ICreateRecordDTO, IRecordDTO, IUpdateRecordDTO } from "./dto"
import { RecordIdVO, type RecordId } from "./record-id.vo"
import { RecordValuesVO } from "./record-values.vo"
import type { IRecordComositeSpecification, RecordComositeSpecification } from "./record.composite-specification"

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

  static fromJSON(table: TableDo, dto: IRecordDTO): RecordDO {
    return new RecordDO(new RecordIdVO(dto.id), RecordValuesVO.fromJSON(table, dto.values))
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

  match(spec: IRecordComositeSpecification): boolean {
    return spec.isSatisfiedBy(this)
  }

  update(table: TableDo, dto: IUpdateRecordDTO): Option<RecordComositeSpecification> {
    const specs: Option<RecordComositeSpecification>[] = []

    for (const [fieldId, value] of Object.entries(dto.values)) {
      const field = table.schema.getFieldById(new FieldIdVo(fieldId))
      if (field.isNone()) continue
      const fieldValue = FieldValueFactory.fromJSON(field.unwrap(), value).unwrap()
      const spec = field.unwrap().updateValue(fieldValue as any)
      specs.push(spec)
    }

    return andOptions(...specs) as Option<RecordComositeSpecification>
  }
}

export type IRecordDO = InstanceType<typeof RecordDO>
