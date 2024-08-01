import { ValueObject } from "@undb/domain"
import { z } from "@undb/zod"

export const tableRLSAction = z.enum(["read", "create", "update", "delete"])

export type ITableRLSActionSchema = z.infer<typeof tableRLSAction>

export class TableRLSAction extends ValueObject<ITableRLSActionSchema> {
  constructor(value: ITableRLSActionSchema) {
    super({ value })
  }
}
