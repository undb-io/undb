import { ApiToken } from './api-token.js'
import { Attachment } from './attachment.js'
import { Audit } from './audit.js'
import { Base } from './base.js'
import { Field, fieldEntities } from './field.js'
import { FLS } from './fls.js'
import { Form } from './form.js'
import { Invitation } from './invitation.js'
import { Member } from './member.js'
import { Option } from './option.js'
import { Outbox } from './outbox.js'
import { RLS } from './rls.js'
import { Share } from './share.js'
import { Table } from './table.js'
import { User } from './user.js'
import { viewEntities } from './view.js'
import { visualizationEntities } from './visualization.js'
import { Webhook } from './webhook.js'

export * from './audit.js'
export * from './base.js'
export * from './field.js'
export * from './option.js'
export * from './outbox.js'
export * from './rls.js'
export * from './table.js'
export * from './user.js'
export * from './webhook.js'

export const entities = [
  Table,
  Base,
  ...viewEntities,
  Form,
  Field,
  ...fieldEntities,
  Option,
  Attachment,
  User,
  ...visualizationEntities,
  Outbox,
  Webhook,
  Share,
  Audit,
  RLS,
  FLS,
  Member,
  Invitation,
  ApiToken,
]
