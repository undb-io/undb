import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { ITemplateSchema } from '@undb/template/dist/index.js'
import type { IImportTemplateInput } from './import-template.command.input.js'

export class ImportTemplateCommand extends Command {
  readonly template: ITemplateSchema

  constructor(props: CommandProps<IImportTemplateInput>) {
    super(props)
    this.template = props.template
  }
}
