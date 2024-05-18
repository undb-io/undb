import type { IImportService } from "../import.service"
import { parse } from "papaparse"

export class CSVImportService implements IImportService {
  async parse(file: File): Promise<{ fields: ({ type: "string" } | { type: "number" })[] }> {
    return new Promise((resolve) => {
      parse(file, {
        complete: (results) => {
          console.log(results)
          resolve({ fields: [] })
        },
      })
    })
  }
}
