import { ValueObject } from "@undb/domain"
import { z } from "@undb/zod"

export const tableRLSSubject = z.union([z.literal("any"), z.literal("nobody")])

export type ITableRLSSubject = z.infer<typeof tableRLSSubject>

export class TableRLSSubject extends ValueObject<ITableRLSSubject> {
  constructor(value: ITableRLSSubject) {
    super({ value })
  }

  toJSON() {
    return this.value
  }
}
