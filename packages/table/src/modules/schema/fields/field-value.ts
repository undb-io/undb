import { ValueObject } from "@undb/domain"

export abstract class FieldValueObject<V> extends ValueObject<V> {
  abstract isEmpty(): boolean
}
