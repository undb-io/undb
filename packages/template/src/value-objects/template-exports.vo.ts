import type { ClsStore, ICreateFieldSchema, Table } from '@undb/core'
import { TableFactory, createFieldSchema, tableIdSchema, tableNameSchema } from '@undb/core'
import { ValueObject } from '@undb/domain'
import { z } from 'zod'

export const templateTableSchema = z.object({
  id: tableIdSchema,
  name: tableNameSchema,
  schema: createFieldSchema.array(),
})

export const exportSchema = z.object({
  tables: templateTableSchema.array(),
})

export type IExportSchema = z.infer<typeof exportSchema>

export class TemplateExport extends ValueObject<IExportSchema> {
  public get tables() {
    return this.props.tables
  }

  static fromTables(tables: Table[]): TemplateExport {
    const exp: IExportSchema = {
      tables: tables.map((table) => ({
        id: table.id.value,
        name: table.name.value,
        schema: table.schema.fields.map((f) => f.json as ICreateFieldSchema),
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
        },
        ctx,
      ).unwrap()
    })
  }
}
