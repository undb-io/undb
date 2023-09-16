import type { ClsStore, ICreateFieldSchema, IQueryRecordSchema, Records, Table } from '@undb/core'
import {
  TableFactory,
  createFieldSchema,
  createViewsSchema,
  queryRecordValues,
  recordIdSchema,
  tableIdSchema,
  tableNameSchema,
  viewsOrderSchema,
} from '@undb/core'
import { ValueObject } from '@undb/domain'
import { z } from 'zod'

export const templateRecord = z.object({
  id: recordIdSchema,
  values: queryRecordValues,
})

export const templateTableSchema = z.object({
  id: tableIdSchema,
  name: tableNameSchema,
  schema: createFieldSchema.array(),
  views: createViewsSchema.optional(),
  viewsOrder: viewsOrderSchema.optional(),
  records: templateRecord.array().optional(),
})

export const templateExportSchema = z.object({
  tables: templateTableSchema.array(),
})

export type ITemplateExportSchema = z.infer<typeof templateExportSchema>

export class TemplateExport extends ValueObject<ITemplateExportSchema> {
  public get tables() {
    return this.props.tables
  }

  static fromJSON(json: ITemplateExportSchema) {
    return new this(json)
  }

  static fromTables(inputs: { table: Table; records?: IQueryRecordSchema[] }[]): TemplateExport {
    const exp: ITemplateExportSchema = {
      tables: inputs.map(({ table, records }) => ({
        id: table.id.value,
        name: table.name.value,
        schema: table.schema.fields.filter((f) => !f.isSystem()).map((f) => f.json as ICreateFieldSchema),
        views: table.views.views.map((v) => v.toJSON()),
        viewsOrder: table.viewsOrder.order,
        records: records?.map((record) => ({ id: record.id, values: record.values })),
      })),
    }
    return new this(exp)
  }

  toTables(ctx: ClsStore): { table: Table; records?: Records }[] {
    return this.tables.map((t) => {
      const table = TableFactory.from(
        {
          id: t.id,
          name: t.name,
          schema: t.schema,
          views: t.views,
          viewsOrder: t.viewsOrder,
        },
        ctx,
      ).unwrap()

      const records = t.records?.map((r) => table.createRecord(r.id, r.values, ctx.user.userId))

      return { table, records }
    })
  }
}
