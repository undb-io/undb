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

  static fromTables(tables: Table[]): TemplateExport {
    const exp: ITemplateExportSchema = {
      tables: tables.map((table) => ({
        id: table.id.value,
        name: table.name.value,
        schema: table.schema.fields.filter((f) => !f.isSystem()).map((f) => f.json as ICreateFieldSchema),
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
