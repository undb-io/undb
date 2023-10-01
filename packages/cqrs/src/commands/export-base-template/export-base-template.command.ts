import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IExportBaseTemplateInput } from './export-base-template.command.input.js'

export class ExportBaseTemplateCommand extends Command implements IExportBaseTemplateInput {
  readonly baseId: string

  constructor(props: CommandProps<IExportBaseTemplateInput>) {
    super(props)
    this.baseId = props.baseId
  }
}
