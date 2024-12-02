import type { ICreateFromTemplateCommand } from "@undb/commands"

export interface IDataService {
  createBaseFromTemplate: (command: ICreateFromTemplateCommand) => Promise<void>
}
