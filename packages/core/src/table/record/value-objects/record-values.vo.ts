import { ValueObject } from '@undb/domain'
import { isString } from 'lodash-es'
import { Option } from 'oxide.ts'
import type {
  FieldValue,
  ICreateFieldsSchema_internal,
  ParentFieldValue,
  ReferenceFieldValue,
  TreeFieldValue,
  UnpackedFieldValue,
} from '../../field/index.js'
import { TreeField } from '../../field/index.js'
import type { TableSchemaIdMap } from '../../value-objects/index.js'
import type { RecordValueJSON, RecordValuePair } from '../record.schema.js'
import type { IQueryRecordValues } from '../record.type.js'

export class RecordValues extends ValueObject<Map<string, FieldValue>> {
  static fromArray(inputs: ICreateFieldsSchema_internal): RecordValues {
    const values = new Map(inputs.map((v) => [v.field.id.value, v.field.createValue(v.value as never)]))
    return new RecordValues(values)
  }

  static fromObject(schema: TableSchemaIdMap, inputs: IQueryRecordValues): RecordValues {
    const values = new Map()
    for (const [fieldId, fieldValue] of Object.entries(inputs)) {
      const field = schema.get(fieldId)
      if (!field) continue
      values.set(fieldId, field.createValue(fieldValue as never))
    }

    return new RecordValues(values)
  }

  static empty(): RecordValues {
    return new RecordValues(new Map())
  }

  public get value() {
    return this.props
  }

  public get valuesPair(): RecordValuePair {
    return Object.fromEntries(this.value)
  }

  public get valuesJSON(): RecordValueJSON {
    const result: RecordValueJSON = {}

    for (const [key, value] of this.value) {
      result[key] = value.json
    }

    return result
  }

  public getForeignRecordIds(schema: TableSchemaIdMap): Set<string> {
    const ids = new Set<string>()

    for (const [fieldId, value] of this) {
      const field = schema.get(fieldId)
      if (!field) continue

      if (field.type === 'reference' || field.type === 'tree') {
        const v = (value as ReferenceFieldValue | TreeFieldValue).unpack()

        if (Array.isArray(v)) {
          for (const recordId of v) {
            ids.add(recordId)
          }
        }
      }

      if (field.type === 'parent') {
        const v = (value as ParentFieldValue).unpack()
        if (isString(v)) {
          ids.add(v)
        }
      }
    }

    return ids
  }

  *[Symbol.iterator]() {
    yield* this.value.entries()
  }

  setValue(fieldId: string, value: FieldValue) {
    this.value.set(fieldId, value)
  }

  /**
   * get unpacked field value
   *
   * @param id - field id
   * @returns unpacked field value
   */
  getUnpackedValue(id: string): Option<UnpackedFieldValue> {
    return Option.nonNull(this.value.get(id)).map((v) => v.unpack())
  }

  /**
   * duplicate record values
   *
   * - remove tree value
   *
   * @param schema - table schema
   */
  duplicate(schema: TableSchemaIdMap): RecordValues {
    const props = new Map()

    for (const [fieldId, fieldValue] of this.props.entries()) {
      const field = schema.get(fieldId)
      if (!field) continue

      if (field instanceof TreeField) continue

      props.set(fieldId, fieldValue)
    }

    return new RecordValues(props)
  }
}
