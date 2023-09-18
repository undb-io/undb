import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { ITemplateSchema } from '@undb/template'
import type { IImportTemplateInput } from './import-template.command.input.js'

export class ImportTemplateCommand extends Command implements IImportTemplateInput {
  public readonly template: ITemplateSchema
  public readonly includeRecords?: boolean

  constructor(props: CommandProps<IImportTemplateInput>) {
    super(props)
    this.template = props.template
    this.includeRecords = props.includeRecords
  }
}
