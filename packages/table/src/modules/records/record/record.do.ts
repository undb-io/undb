import { AggregateRoot, andOptions, type Option } from "@undb/domain"
import type { TableDo } from "../../../table.do"
import { ID_TYPE, type FieldValue } from "../../schema"
import { FieldIdVo, type FieldId } from "../../schema/fields/field-id.vo"
import { FieldValueFactory } from "../../schema/fields/field-value.factory"
import type { SchemaMap } from "../../schema/schema.type"
import { RecordCreatedEvent, RecordDeletedEvent, RecordUpdatedEvent, type IRecordEvent } from "../events"
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

    const event = RecordCreatedEvent.create(table, record)
    record.addDomainEvent(event)

    return record
  }

  static fromJSON(table: TableDo, dto: IRecordDTO): RecordDO {
    return new RecordDO(new RecordIdVO(dto.id), RecordValuesVO.fromJSON(table, dto.values))
  }

  public flatten(): Record<string, any> {
    return {
      id: this.id.value,
      ...this.values.toJSON(),
    }
  }

  public toJSON(): IRecordDTO {
    return {
      id: this.id.value,
      values: this.values.toJSON(),
    }
  }

  getMuttableValues(schema: SchemaMap) {
    return this.values.getMuttableValues(schema)
  }

  getValue(fieldId: FieldId): Option<FieldValue> {
    return this.values.getValue(fieldId)
  }

  match(spec: IRecordComositeSpecification): boolean {
    return spec.isSatisfiedBy(this)
  }

  duplicate(table: TableDo): RecordDO {
    const record = new RecordDO(RecordIdVO.create(), this.values.duplicate(table.schema.fieldMapById))
    record.addDomainEvent(RecordCreatedEvent.create(table, record))
    return record
  }

  update(table: TableDo, dto: IUpdateRecordDTO["values"]): Option<RecordComositeSpecification> {
    const specs: Option<RecordComositeSpecification>[] = []

    const updatedFields = new Set<string>()

    for (const [fieldId, value] of Object.entries(dto)) {
      const field = table.schema.getFieldById(new FieldIdVo(fieldId))

      if (field.isNone()) continue
      if (!field.unwrap().isMutable) continue

      const schema = field.unwrap().valueSchema
      const parsed = schema.parse(value)

      const fieldValue = FieldValueFactory.fromJSON(field.unwrap(), parsed).expect(
        `invalid field value ${value} for ${field.unwrap().id.value}`,
      )
      const spec = field.unwrap().$updateValue(fieldValue as any)
      if (spec.isSome()) {
        updatedFields.add(fieldId)
        specs.push(spec)
      }
    }

    const spec = andOptions(...specs) as Option<RecordComositeSpecification>
    if (spec.isSome()) {
      const previousValues = this.values.getValues(updatedFields)
      spec.unwrap().mutate(this)
      const values = this.values.getValues(updatedFields)

      const event = RecordUpdatedEvent.create(table, previousValues, values, this)
      this.addDomainEvent(event)
    }

    return spec
  }

  delete(table: TableDo) {
    const event = RecordDeletedEvent.create(table, this)
    this.addDomainEvent(event)
  }

  toReadable(table: TableDo) {
    const schema = table.schema.fieldMapById
    const values = this.values.toReadable(table)
    return {
      [schema.get(ID_TYPE)!.name.value]: this.id.value,
      ...values,
    }
  }

  getDisplayValue(table: TableDo): string {
    const fields = table.schema.displayFields
    if (fields.length === 0) return this.id.value

    const values = this.flatten()
    return fields.map((field) => values[field.id.value]).join(", ")
  }
}

export type IRecordDO = InstanceType<typeof RecordDO>
