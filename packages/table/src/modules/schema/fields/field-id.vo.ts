import { IdFactory } from '@undb/domain'
import { z } from 'zod'

const prefix = 'fld'
const size = 6

export const fieldId = z.string().startsWith(prefix)

export const FieldIdVo = IdFactory(prefix, size, fieldId)

export type FieldId = InstanceType<typeof FieldIdVo>
