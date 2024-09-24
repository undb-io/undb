import { AggregateRoot, andOptions, None, type Option } from "@undb/domain"
import { isEmpty } from "radash"
import type { TableDo } from "../../../table.do"
import { IdFieldValue, type FieldValue } from "../../schema"
import { type FieldId } from "../../schema/fields/field-id.vo"
import { FieldValueFactory } from "../../schema/fields/field-value.factory"
import type { SchemaIdMap } from "../../schema/schema.type"
import { RecordCreatedEvent, RecordDeletedEvent, RecordUpdatedEvent, type IRecordEvent } from "../events"
import type { ICreateRecordDTO, IReadableRecordDTO, IRecordDTO, IUpdateRecordDTO } from "./dto"
import { RecordDisplayValuesVO } from "./record-display-values.vo"
import { RecordIdVO, type RecordId } from "./record-id.vo"
import { RecordValuesVO } from "./record-values.vo"
import type { IRecordComositeSpecification, RecordComositeSpecification } from "./record.composite-specification"

export class RecordDO extends AggregateRoot<IRecordEvent> {
  constructor(
    readonly id: RecordId,
    readonly values: RecordValuesVO,
    readonly displayValues: RecordDisplayValuesVO | undefined = undefined,
  ) {
    super()
  }

  static create(table: TableDo, dto: ICreateRecordDTO) {
    const record = new RecordDO(
      RecordIdVO.fromStringOrCreate(dto.id ?? undefined),
      RecordValuesVO.create(table, dto.values),
    )

    const event = RecordCreatedEvent.create(table, record)
    record.addDomainEvent(event)

    return record
  }

  static fromJSON(table: TableDo, dto: IRecordDTO): RecordDO {
    return new RecordDO(
      new RecordIdVO(dto.id),
      RecordValuesVO.fromJSON(table, dto.values),
      dto.displayValues ? RecordDisplayValuesVO.fromJSON(table, dto.displayValues) : undefined,
    )
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

  getMuttableValues(schema: SchemaIdMap) {
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
    if (isEmpty(dto)) return None

    const specs: Option<RecordComositeSpecification>[] = []

    const updatedFields = new Set<string>()

    for (const [idOrName, value] of Object.entries(dto)) {
      const field = table.schema.getFieldByIdOrName(idOrName)

      if (field.isNone()) continue
      if (!field.unwrap().isMutable) continue

      const schema = field.unwrap().valueSchema
      const parsed = schema.parse(value)

      const fieldValue = FieldValueFactory.fromJSON(field.unwrap(), parsed).expect(
        `invalid field value ${value} for ${field.unwrap().id.value}`,
      )
      const spec = field.unwrap().$updateValue(fieldValue as any)
      if (spec.isSome()) {
        updatedFields.add(field.unwrap().id.value)
        specs.push(spec)
      }
    }

    const spec = andOptions(...specs) as Option<RecordComositeSpecification>
    if (spec.isSome()) {
      const previous = this.toReadable(table, updatedFields)
      spec.unwrap().mutate(this)
      const record = this.toReadable(table, updatedFields)

      const event = RecordUpdatedEvent.create(table, previous, record, this)
      this.addDomainEvent(event)
    }

    return spec
  }

  delete(table: TableDo) {
    const event = RecordDeletedEvent.create(table, this)
    this.addDomainEvent(event)
  }

  toReadable(table: TableDo, fields = new Set(table.schema.fields.map((f) => f.id.value))): IReadableRecordDTO {
    const values = this.values.toReadable(table, fields)
    const displayValues = this.displayValues?.toReadable(table, fields)
    return {
      id: this.id.value,
      values,
      displayValues,
    }
  }

  getDisplayValueByField(fieldId: FieldId) {
    return this.displayValues?.getValue(fieldId)
  }

  getDisplayValue(table: TableDo): string {
    const fields = table.schema.getDisplayFields()
    if (fields.length === 0) return this.id.value

    const values = this.flatten()
    return fields.map((field) => values[field.id.value]).join(", ")
  }

  toInsertSpec(table: TableDo): RecordComositeSpecification {
    const spec = this.values.toInsertSpec(table)

    const id = table.schema.getIdField()
    return andOptions(id.getMutationSpec(new IdFieldValue(this.id.value)), spec).unwrap() as RecordComositeSpecification
  }
}

export type IRecordDO = InstanceType<typeof RecordDO>
