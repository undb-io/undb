import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateTableCommand } from './create-table.command'

@CommandHandler(CreateTableCommand)
export class CreateTableCommandHandler implements ICommandHandler<CreateTableCommand> {
  execute(command: CreateTableCommand): Promise<any> {
    throw new Error('Method not implemented.')
  }
}
