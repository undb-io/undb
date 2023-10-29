import { createZodDto } from '@anatine/zod-nestjs'
import { extendApi } from '@anatine/zod-openapi'
import { fieldIdSchema, recordIdSchema } from '@undb/core'
import type { ZodArray, ZodNonEmptyArray, ZodOptional, ZodString } from 'zod'
import z from 'zod'

const createRecord = z.object({
  id: recordIdSchema.optional() as unknown as ZodOptional<ZodString>,
  values: z.record(fieldIdSchema, z.any()),
})

export const CreateRecord = extendApi(createRecord)

export class CreateRecordDTO extends createZodDto(CreateRecord) {}

export const CreateRecordBulk = extendApi(
  z.object({
    records: createRecord.array() as unknown as ZodArray<typeof createRecord>,
  }),
)

export class CreateRecordBulkDTO extends createZodDto(CreateRecordBulk) {}

export const UpdateRecord = extendApi(
  z.object({
    values: z.record(fieldIdSchema, z.any()),
  }),
)

export class UpdateRecordDTO extends createZodDto(UpdateRecord) {}

const updateRecord = z.object({
  id: recordIdSchema,
  values: z.record(fieldIdSchema, z.any()),
})

export const UpdateRecordBulk = extendApi(
  z.object({
    records: updateRecord.array() as unknown as ZodArray<typeof updateRecord>,
  }),
)

export class UpdateRecordBulkDTO extends createZodDto(UpdateRecordBulk) {}

export const DeleteRecordsBulk = extendApi(
  z.object({
    ids: recordIdSchema.array().nonempty() as unknown as ZodNonEmptyArray<ZodString>,
  }),
)

export class DeleteRecordsBulkDTO extends createZodDto(DeleteRecordsBulk) {}

export const DuplicateRecordsBulk = extendApi(
  z.object({
    ids: recordIdSchema.array().nonempty() as unknown as ZodNonEmptyArray<ZodString>,
  }),
)

export class DuplicateRecordsBulkDTO extends createZodDto(DuplicateRecordsBulk) {}
