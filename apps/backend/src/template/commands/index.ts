import { NestExportTemplateCommandHandler } from './export-template.command-handler.js'
import { NestImportTemplateCommandHandler } from './import-template.command-handler.js'

export const commandHandlers = [NestExportTemplateCommandHandler, NestImportTemplateCommandHandler]
