import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IExportTableTemplateInput } from './export-table-template.command.input.js'

export class ExportTableTemplateCommand extends Command {
  readonly tableId: string
  readonly recordIds?: string[]

  constructor(props: CommandProps<IExportTableTemplateInput>) {
    super(props)
    this.tableId = props.tableId
    this.recordIds = props.recordIds
  }
}
