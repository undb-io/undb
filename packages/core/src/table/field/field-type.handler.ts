import type { IFieldType } from './field.type.js'

export type IFieldTypeHandler = {
  [key in IFieldType]: () => void
}

export abstract class AbstractFieldTypeHandler implements IFieldTypeHandler {
  abstract id(): void
  abstract string(): void
  abstract number(): void
  abstract color(): void
  abstract email(): void
  abstract qrcode(): void
  abstract url(): void
  abstract json(): void
  abstract date(): void
  abstract select(): void
  abstract bool(): void
  abstract reference(): void
  abstract tree(): void
  abstract parent(): void
  abstract rating(): void
  abstract currency(): void
  abstract count(): void
  abstract lookup(): void
  abstract sum(): void
  abstract average(): void
  abstract attachment(): void
  abstract collaborator(): void
  abstract min(): void
  abstract max(): void
  abstract ['multi-select'](): void
  abstract ['date-range'](): void
  abstract ['auto-increment'](): void
  abstract ['created-at'](): void
  abstract ['created-by'](): void
  abstract ['updated-at'](): void
  abstract ['updated-by'](): void
}
