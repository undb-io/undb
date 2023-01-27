import { Field, fieldEntities } from './field'
import { Option } from './option'
import { Table } from './table'
import { viewEntities } from './view'

export * from './field'
export * from './option'
export * from './table'

export const entities = [Table, ...viewEntities, Field, ...fieldEntities, Option]
