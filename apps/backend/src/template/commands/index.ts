import { NestExportBaseTemplateCommandHandler } from './export-base-template.command-handler.js'
import { NestExportTableTemplateCommandHandler } from './export-table-template.command-handler.js'
import { NestImportTemplateCommandHandler } from './import-template.command-handler.js'

export const commandHandlers = [
  NestExportTableTemplateCommandHandler,
  NestImportTemplateCommandHandler,
  NestExportBaseTemplateCommandHandler,
]
