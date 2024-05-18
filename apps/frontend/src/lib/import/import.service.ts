import type { IInferCreateFieldDTO } from "@undb/table"

export interface IImportService {
  parse(file: File): Promise<{ fields: IInferCreateFieldDTO[] }>
}
