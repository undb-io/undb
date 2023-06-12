import { Attachment } from './attachment.js'
import { Field, fieldEntities } from './field.js'
import { Option } from './option.js'
import { Outbox } from './outbox.js'
import { Table } from './table.js'
import { User } from './user.js'
import { viewEntities } from './view.js'
import { virsualizationEntities } from './virsualization.js'

export * from './field.js'
export * from './option.js'
export * from './table.js'

export const entities = [
  Table,
  ...viewEntities,
  Field,
  ...fieldEntities,
  Option,
  Attachment,
  User,
  ...virsualizationEntities,
  Outbox,
]
