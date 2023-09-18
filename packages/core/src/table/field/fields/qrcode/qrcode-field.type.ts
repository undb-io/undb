import * as z from 'zod'
import { baseFieldQuerySchema, createBaseFieldSchema, updateBaseFieldSchema } from '../../field-base.schema.js'
import { FIELD_TYPE_KEY } from '../../field.constants.js'
import type { IBaseField } from '../../field.type.js'
import { qrcodeDataSchema, type QRCodeData } from './qrcode-data.vo.js'
import { QRCodeField } from './qrcode-field.js'

export const qrcodeTypeSchema = z.literal('qrcode')
export type QRCodeFieldType = z.infer<typeof qrcodeTypeSchema>
const qrcodeTypeObjectSchema = z.object({ [FIELD_TYPE_KEY]: qrcodeTypeSchema })

export const createQRCodeFieldSchema = createBaseFieldSchema.merge(qrcodeTypeObjectSchema).merge(qrcodeDataSchema)
export type ICreateQRCodeFieldInput = z.infer<typeof createQRCodeFieldSchema>

export const updateQRCodeFieldSchema = updateBaseFieldSchema.merge(qrcodeTypeObjectSchema).merge(qrcodeDataSchema)
export type IUpdateQRCodeFieldInput = z.infer<typeof updateQRCodeFieldSchema>

export const qrcodeFieldQuerySchema = baseFieldQuerySchema.merge(qrcodeTypeObjectSchema).merge(qrcodeDataSchema)
export type IQRCodeFieldQuerySchema = z.infer<typeof qrcodeFieldQuerySchema>

export const qrcodeFieldValue = z.string().nullable()
export type IQRCodeFieldValue = z.infer<typeof qrcodeFieldValue>

export const createQRCodeFieldValue = qrcodeFieldValue
export type ICreateQRCodeFieldValue = z.infer<typeof createQRCodeFieldValue>

export const qrcodeFieldQueryValue = qrcodeFieldValue
export type IQRCodeFieldQueryValue = z.infer<typeof qrcodeFieldQueryValue>

export const createQRCodeFieldValue_internal = z
  .object({ value: createQRCodeFieldValue })
  .merge(qrcodeTypeObjectSchema)
  .merge(z.object({ field: z.instanceof(QRCodeField) }))
export type ICreateQRCodeFieldValue_internal = z.infer<typeof createQRCodeFieldValue_internal>

export const qrcodeReadableValueSchema = qrcodeFieldQueryValue

export type IQRCodeField = IBaseField & {
  data: QRCodeData
}
