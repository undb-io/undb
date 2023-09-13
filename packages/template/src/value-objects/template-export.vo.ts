import type { ClsStore, ICreateFieldSchema, Table } from '@undb/core'
import {
  TableFactory,
  createFieldSchema,
  createViewsSchema,
  tableIdSchema,
  tableNameSchema,
  viewsOrderSchema,
} from '@undb/core'
import { ValueObject } from '@undb/domain'
import { z } from 'zod'

export const templateTableSchema = z.object({
  id: tableIdSchema,
  name: tableNameSchema,
  schema: createFieldSchema.array(),
  views: createViewsSchema.optional(),
  viewsOrder: viewsOrderSchema.optional(),
})

export const exportSchema = z.object({
  tables: templateTableSchema.array(),
})

export type IExportSchema = z.infer<typeof exportSchema>

export class TemplateExport extends ValueObject<IExportSchema> {
  public get tables() {
    return this.props.tables
  }

  static fromJSON(json: IExportSchema) {
    return new this(json)
  }

  static fromTables(tables: Table[]): TemplateExport {
    const exp: IExportSchema = {
      tables: tables.map((table) => ({
        id: table.id.value,
        name: table.name.value,
        schema: table.schema.fields.map((f) => f.json as ICreateFieldSchema),
        views: table.views.views.map((v) => v.toJSON()),
        viewsOrder: table.viewsOrder.order,
      })),
    }
    return new this(exp)
  }

  toTables(ctx: ClsStore): Table[] {
    return this.tables.map((table) => {
      return TableFactory.from(
        {
          id: table.id,
          name: table.name,
          schema: table.schema,
          views: table.views,
          viewsOrder: table.viewsOrder,
        },
        ctx,
      ).unwrap()
    })
  }
}
