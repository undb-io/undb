import { CreateFromTemplateCommand, type ICreateFromTemplateCommand } from "@undb/commands"
import { CommandBus } from "@undb/cqrs"
import { inject, singleton } from "@undb/di"
import type { ICommandBus } from "@undb/domain"
import type { IDataService } from "./data-service.interface"

@singleton()
export class DataService implements IDataService {
  constructor(
    @inject(CommandBus)
    private readonly commandBus: ICommandBus,
  ) {}

  async createBaseFromTemplate(command: ICreateFromTemplateCommand): Promise<void> {
    await this.commandBus.execute(new CreateFromTemplateCommand(command))
  }
}
