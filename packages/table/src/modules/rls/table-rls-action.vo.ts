import { ValueObject } from "@undb/domain"
import { z } from "@undb/zod"

export const tableRLSAction = z.enum(["list", "create", "update", "delete", "view"])

export type ITableRLSActionSchema = typeof tableRLSAction

export class TableRLSAction extends ValueObject<ITableRLSActionSchema> {
  constructor(value: ITableRLSActionSchema) {
    super(value)
  }
}
