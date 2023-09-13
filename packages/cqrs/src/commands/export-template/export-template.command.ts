import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IExportTemplateInput } from './export-template.command.input.js'

export class ExportTemplateCommand extends Command {
  readonly tableId: string

  constructor(props: CommandProps<IExportTemplateInput>) {
    super(props)
    this.tableId = props.tableId
  }
}
