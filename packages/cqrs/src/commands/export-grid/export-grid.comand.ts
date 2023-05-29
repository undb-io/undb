import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IExportGridInput } from './export-grid.command.input.js'

export class ExportGridCommand extends Command {
  readonly tableId: string
  readonly viewId: string

  constructor(props: CommandProps<IExportGridInput>) {
    super(props)
    this.tableId = props.tableId
    this.viewId = props.viewId
  }
}
