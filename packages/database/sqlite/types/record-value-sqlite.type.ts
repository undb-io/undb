import type { Primitive } from 'type-fest'

export type RecordValueSqlitePrimitives = Primitive | Date | string[]

export type RecordValueData = Record<string, RecordValueSqlitePrimitives>
