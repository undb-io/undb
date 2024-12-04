import {
  CreateFromTemplateCommand,
  DeleteBaseCommand,
  type ICreateFromTemplateCommand,
  type IDeleteBaseCommand,
} from "@undb/commands"
import { CommandBus, QueryBus } from "@undb/cqrs"
import { container, inject, injectable } from "@undb/di"
import type { ICommandBus, IQueryBus } from "@undb/domain"
import {
  GetAggregatesQuery,
  GetRecordByIdQuery,
  GetRecordsQuery,
  GetTableQuery,
  type IGetAggregatesOutput,
  type IGetAggregatesQuery,
  type IGetRecordByIdOutput,
  type IGetRecordByIdQuery,
  type IGetRecordsOutput,
  type IGetRecordsQuery,
  type IGetTableOutput,
  type IGetTableQuery,
} from "@undb/queries"
import type { ITemplateService, TemplateDTO } from "@undb/template"
import { TemplateService as TemplateServiceImpl } from "@undb/template"
import { injectIsLocal, injectTrpcClient, IS_LOCAL, type TrpcProxyClient } from "./data-service.provider"

@injectable()
class TemplateService {
  constructor(
    @injectIsLocal()
    private readonly isLocal: boolean,
    @inject(CommandBus)
    private readonly commandBus: ICommandBus,
    @inject(TemplateServiceImpl)
    private readonly templateService: ITemplateService,
  ) {}

  async save(template: TemplateDTO, includeData: boolean = false): Promise<void> {
    if (!this.isLocal) {
      throw new Error("Template service save is only supported in local mode")
    }
    await this.templateService.save(template, includeData)
  }

  async createBaseFromTemplate(command: ICreateFromTemplateCommand): Promise<void> {
    await this.commandBus.execute(new CreateFromTemplateCommand(command))
  }
}

@injectable()
class BaseService {
  constructor(
    @injectTrpcClient()
    private readonly trpc: TrpcProxyClient,
    @injectIsLocal()
    private readonly isLocal: boolean,
    @inject(CommandBus)
    private readonly commandBus: ICommandBus,
  ) {}

  async deleteBase(command: IDeleteBaseCommand): Promise<void> {
    if (this.isLocal) {
      return this.commandBus.execute(new DeleteBaseCommand(command))
    }
    await this.trpc.base.delete.mutate(command)
  }
}

@injectable()
class TableService {
  constructor(
    @injectTrpcClient()
    private readonly trpc: TrpcProxyClient,
    @injectIsLocal()
    private readonly isLocal: boolean,
    @inject(QueryBus)
    private readonly queryBus: IQueryBus,
  ) {}

  async getTable(query: IGetTableQuery): Promise<IGetTableOutput> {
    if (this.isLocal) {
      return await this.queryBus.execute(new GetTableQuery(query))
    }
    return (await this.trpc.table.get.query(query)) as IGetTableOutput
  }
}

@injectable()
class RecordsService {
  constructor(
    @injectTrpcClient()
    private readonly trpc: TrpcProxyClient,
    @injectIsLocal()
    private readonly isLocal: boolean,
    @inject(QueryBus)
    private readonly queryBus: IQueryBus,
  ) {}

  async getRecords(query: IGetRecordsQuery): Promise<IGetRecordsOutput> {
    if (this.isLocal) {
      return await this.queryBus.execute(new GetRecordsQuery(query))
    }
    return (await this.trpc.record.list.query(query)) as IGetRecordsOutput
  }

  async getRecordById(query: IGetRecordByIdQuery): Promise<IGetRecordByIdOutput> {
    if (this.isLocal) {
      return await this.queryBus.execute(new GetRecordByIdQuery(query))
    }
    return (await this.trpc.record.get.query(query)) as IGetRecordByIdOutput
  }

  async getAggregates(query: IGetAggregatesQuery): Promise<IGetAggregatesOutput> {
    if (this.isLocal) {
      return await this.queryBus.execute(new GetAggregatesQuery(query))
    }
    return (await this.trpc.record.aggregate.query(query)) as IGetAggregatesOutput
  }
}

@injectable()
export class DataService {
  constructor(
    @inject(TemplateService)
    public readonly template: TemplateService,
    @inject(RecordsService)
    public readonly records: RecordsService,
    @inject(BaseService)
    public readonly base: BaseService,
    @inject(TableService)
    public readonly table: TableService,
  ) {}
}

export const getDataService = (isLocal: boolean) => {
  container.register(IS_LOCAL, { useValue: isLocal })
  return container.resolve<DataService>(DataService)
}
