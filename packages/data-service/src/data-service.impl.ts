import { CreateFromTemplateCommand, type ICreateFromTemplateCommand } from "@undb/commands"
import { CommandBus, QueryBus } from "@undb/cqrs"
import { inject, singleton } from "@undb/di"
import type { ICommandBus, IQueryBus } from "@undb/domain"
import { GetRecordsQuery, type IGetRecordsOutput, type IGetRecordsQuery } from "@undb/queries"
import type { ITemplateService, TemplateDTO } from "@undb/template"
import { TemplateService as TemplateServiceImpl } from "@undb/template"

@singleton()
class TemplateService {
  constructor(
    @inject(CommandBus)
    private readonly commandBus: ICommandBus,
    @inject(TemplateServiceImpl)
    private readonly templateService: ITemplateService,
  ) {}

  async save(template: TemplateDTO, includeData: boolean = false): Promise<void> {
    await this.templateService.save(template, includeData)
  }

  async createBaseFromTemplate(command: ICreateFromTemplateCommand): Promise<void> {
    await this.commandBus.execute(new CreateFromTemplateCommand(command))
  }
}

@singleton()
class RecordsService {
  constructor(
    @inject(QueryBus)
    private readonly queryBus: IQueryBus,
  ) {}

  async getRecords(query: IGetRecordsQuery): Promise<IGetRecordsOutput> {
    return await this.queryBus.execute(new GetRecordsQuery(query))
  }
}

@singleton()
export class DataService {
  constructor(
    @inject(TemplateService)
    public readonly template: TemplateService,
    @inject(RecordsService)
    public readonly records: RecordsService,
  ) {}
}
