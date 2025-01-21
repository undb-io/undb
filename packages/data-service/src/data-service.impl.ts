import {
  AddDashboardWidgetCommand,
  BulkDeleteRecordsCommand,
  BulkDuplicateRecordsCommand,
  BulkUpdateRecordsCommand,
  CreateBaseCommand,
  CreateFromTemplateCommand,
  CreateRecordCommand,
  CreateRecordsCommand,
  CreateTableCommand,
  CreateTableFieldCommand,
  CreateTableViewCommand,
  CreateViewWidgetCommand,
  DeleteBaseCommand,
  DeleteTableCommand,
  DeleteTableFieldCommand,
  DeleteViewCommand,
  DuplicateTableFieldCommand,
  DuplicateViewCommand,
  SetViewColorCommand,
  SetViewFieldsCommand,
  SetViewFilterCommand,
  SetViewOptionCommand,
  SetViewSortCommand,
  TriggerRecordButtonCommand,
  UpdateRecordCommand,
  UpdateTableFieldCommand,
  UpdateViewCommand,
  type IAddDashboardWidgetCommand,
  type IBulkDeleteRecordsCommand,
  type IBulkDuplicateRecordsCommand,
  type IBulkUpdateRecordsCommand,
  type IBulkUpdateRecordsCommandOutput,
  type ICreateBaseCommand,
  type ICreateBaseCommandOutput,
  type ICreateFieldCommand,
  type ICreateFromTemplateCommand,
  type ICreateFromTemplateCommandOutput,
  type ICreateRecordCommand,
  type ICreateRecordCommandOutput,
  type ICreateRecordsCommand,
  type ICreateRecordsCommandOutput,
  type ICreateTableCommand,
  type ICreateTableCommandOutput,
  type ICreateTableViewCommandOutput,
  type ICreateViewCommand,
  type ICreateViewWidgetCommand,
  type IDeleteBaseCommand,
  type IDeleteFieldCommand,
  type IDeleteTableCommand,
  type IDeleteViewCommand,
  type IDuplicateFieldCommand,
  type IDuplicateViewCommand,
  type IDuplicateViewCommandOutput,
  type ISetViewColorCommand,
  type ISetViewFieldsCommand,
  type ISetViewFilterCommand,
  type ISetViewOptionCommand,
  type ISetViewSortCommand,
  type ITriggerRecordButtonCommand,
  type IUpdateFieldCommand,
  type IUpdateRecordCommand,
  type IUpdateViewCommand,
} from "@undb/commands"
import { CommandBus, QueryBus } from "@undb/cqrs"
import { inject, injectable } from "@undb/di"
import type { ICommandBus, IQueryBus } from "@undb/domain"
import { injectQueryBuilder, type IQueryBuilder } from "@undb/persistence/client"
import {
  GetAggregatesQuery,
  GetBaseQuery,
  GetBasesQuery,
  GetDashboardByIdQuery,
  GetDashboardsQuery,
  GetRecordByIdQuery,
  GetRecordsQuery,
  GetTableQuery,
  GetTablesQuery,
  GetTemplatesQuery,
  type IGetAggregatesOutput,
  type IGetAggregatesQuery,
  type IGetBaseOutput,
  type IGetBaseQuery,
  type IGetBasesQuery,
  type IGetBasesQueryOutput,
  type IGetDashboardByIdOutput,
  type IGetDashboardByIdQuery,
  type IGetDashboardsOutput,
  type IGetDashboardsQuery,
  type IGetRecordByIdOutput,
  type IGetRecordByIdQuery,
  type IGetRecordsOutput,
  type IGetRecordsQuery,
  type IGetTableOutput,
  type IGetTableQuery,
  type IGetTablesOutput,
  type IGetTablesQuery,
  type IGetTemplatesQuery,
  type IGetTemplatesQueryOutput,
} from "@undb/queries"
import type { ITemplateService, TemplateDTO } from "@undb/template"
import { TemplateService as TemplateServiceImpl } from "@undb/template"
import { injectIsLocal, injectIsPlayground, injectTrpcClient, type TrpcProxyClient } from "./data-service.provider"

@injectable()
class TemplateService {
  constructor(
    @injectIsLocal()
    private readonly isLocal: boolean,
    @injectIsPlayground()
    private readonly isPlayground: boolean,
    @inject(CommandBus)
    private readonly commandBus: ICommandBus,
    @inject(TemplateServiceImpl)
    private readonly templateService: ITemplateService,
    @injectTrpcClient()
    private readonly trpc: TrpcProxyClient,
    @inject(QueryBus)
    private readonly queryBus: IQueryBus,
  ) {}

  listTemplates = async (query: IGetTemplatesQuery): Promise<IGetTemplatesQueryOutput> => {
    if (this.isLocal) {
      return await this.queryBus.execute(new GetTemplatesQuery())
    }
    return (await this.trpc.template.list.query({})) as IGetTemplatesQueryOutput
  }

  save = async (template: TemplateDTO, includeData: boolean = false): Promise<void> => {
    if (!this.isLocal) {
      throw new Error("Template service save is only supported in local mode")
    }
    return this.templateService.save(template, includeData)
  }

  createFromTemplate = async (command: ICreateFromTemplateCommand): Promise<ICreateFromTemplateCommandOutput> => {
    if (this.isLocal && this.isPlayground) {
      return this.commandBus.execute(new CreateFromTemplateCommand(command))
    }

    return this.trpc.template.createFromTemplate.mutate(command)
  }
}

@injectable()
class BaseService {
  constructor(
    @injectTrpcClient()
    private readonly trpc: TrpcProxyClient,
    @injectIsLocal()
    private readonly isLocal: boolean,
    @inject(QueryBus)
    private readonly queryBus: IQueryBus,
    @inject(CommandBus)
    private readonly commandBus: ICommandBus,
  ) {}

  listBases = async (query: IGetBasesQuery): Promise<IGetBasesQueryOutput> => {
    if (this.isLocal) {
      return await this.queryBus.execute(new GetBasesQuery())
    }
    return (await this.trpc.base.list.query(query)) as IGetBasesQueryOutput
  }

  getBase = async (query: IGetBaseQuery): Promise<IGetBaseOutput> => {
    if (this.isLocal) {
      return await this.queryBus.execute(new GetBaseQuery(query))
    }
    return (await this.trpc.base.get.query(query)) as IGetBaseOutput
  }

  createBase = async (command: ICreateBaseCommand): Promise<ICreateBaseCommandOutput> => {
    if (this.isLocal) {
      return this.commandBus.execute(new CreateBaseCommand(command))
    }
    return this.trpc.base.create.mutate(command)
  }

  deleteBase = async (command: IDeleteBaseCommand): Promise<void> => {
    if (this.isLocal) {
      return this.commandBus.execute(new DeleteBaseCommand(command))
    }
    await this.trpc.base.delete.mutate(command)
  }
}

@injectable()
class ViewService {
  constructor(
    @injectTrpcClient()
    private readonly trpc: TrpcProxyClient,
    @injectIsLocal()
    private readonly isLocal: boolean,
    @inject(CommandBus)
    private readonly commandBus: ICommandBus,
  ) {}

  createView = async (command: ICreateViewCommand): Promise<ICreateTableViewCommandOutput> => {
    if (this.isLocal) {
      return this.commandBus.execute(new CreateTableViewCommand(command))
    }
    return this.trpc.table.view.create.mutate(command)
  }

  updateView = async (command: IUpdateViewCommand): Promise<void> => {
    if (this.isLocal) {
      return this.commandBus.execute(new UpdateViewCommand(command))
    }
    await this.trpc.table.view.update.mutate(command)
  }

  duplicateView = async (command: IDuplicateViewCommand): Promise<IDuplicateViewCommandOutput> => {
    if (this.isLocal) {
      return this.commandBus.execute(new DuplicateViewCommand(command))
    }
    return this.trpc.table.view.duplicate.mutate(command)
  }

  deleteView = async (command: IDeleteViewCommand): Promise<void> => {
    if (this.isLocal) {
      return this.commandBus.execute(new DeleteViewCommand(command))
    }
    await this.trpc.table.view.delete.mutate(command)
  }

  createViewWidget = async (command: ICreateViewWidgetCommand): Promise<void> => {
    if (this.isLocal) {
      await this.commandBus.execute(new CreateViewWidgetCommand(command))
    } else {
      await this.trpc.table.view.widget.create.mutate(command)
    }
  }

  setOption = async (command: ISetViewOptionCommand): Promise<void> => {
    if (this.isLocal) {
      return this.commandBus.execute(new SetViewOptionCommand(command))
    }
    await this.trpc.table.view.setOption.mutate(command)
  }

  setFilter = async (command: ISetViewFilterCommand): Promise<void> => {
    if (this.isLocal) {
      return this.commandBus.execute(new SetViewFilterCommand(command))
    }
    await this.trpc.table.view.setFilter.mutate(command)
  }

  setColor = async (command: ISetViewColorCommand): Promise<void> => {
    if (this.isLocal) {
      return this.commandBus.execute(new SetViewColorCommand(command))
    }
    await this.trpc.table.view.setColor.mutate(command)
  }

  setSort = async (command: ISetViewSortCommand): Promise<void> => {
    if (this.isLocal) {
      return this.commandBus.execute(new SetViewSortCommand(command))
    }
    await this.trpc.table.view.setSort.mutate(command)
  }

  setFields = async (command: ISetViewFieldsCommand): Promise<void> => {
    if (this.isLocal) {
      return this.commandBus.execute(new SetViewFieldsCommand(command))
    }
    await this.trpc.table.view.setFields.mutate(command)
  }
}

@injectable()
class FieldService {
  constructor(
    @injectTrpcClient()
    private readonly trpc: TrpcProxyClient,
    @injectIsLocal()
    private readonly isLocal: boolean,
    @inject(CommandBus)
    private readonly commandBus: ICommandBus,
  ) {}

  createField = async (command: ICreateFieldCommand): Promise<void> => {
    if (this.isLocal) {
      return this.commandBus.execute(new CreateTableFieldCommand(command))
    }
    await this.trpc.table.field.create.mutate(command)
  }

  updateField = async (command: IUpdateFieldCommand): Promise<void> => {
    if (this.isLocal) {
      return this.commandBus.execute(new UpdateTableFieldCommand(command))
    }
    await this.trpc.table.field.update.mutate(command)
  }

  duplicateField = async (command: IDuplicateFieldCommand): Promise<void> => {
    if (this.isLocal) {
      return this.commandBus.execute(new DuplicateTableFieldCommand(command))
    }
    await this.trpc.table.field.duplicate.mutate(command)
  }

  deleteField = async (command: IDeleteFieldCommand): Promise<void> => {
    if (this.isLocal) {
      return this.commandBus.execute(new DeleteTableFieldCommand(command))
    }
    await this.trpc.table.field.delete.mutate(command)
  }
}

@injectable()
class TableService {
  constructor(
    @inject(ViewService)
    public readonly view: ViewService,
    @inject(FieldService)
    public readonly field: FieldService,
    @injectTrpcClient()
    private readonly trpc: TrpcProxyClient,
    @injectIsLocal()
    private readonly isLocal: boolean,
    @inject(QueryBus)
    private readonly queryBus: IQueryBus,
    @inject(CommandBus)
    private readonly commandBus: ICommandBus,
  ) {}

  getTable = async (query: IGetTableQuery): Promise<IGetTableOutput> => {
    if (this.isLocal) {
      return await this.queryBus.execute(new GetTableQuery(query))
    }
    return (await this.trpc.table.get.query(query)) as IGetTableOutput
  }

  getTables = async (query: IGetTablesQuery): Promise<IGetTablesOutput> => {
    if (this.isLocal) {
      return await this.queryBus.execute(new GetTablesQuery(query))
    }
    return (await this.trpc.table.list.query(query)) as IGetTablesOutput
  }

  createTable = async (command: ICreateTableCommand): Promise<ICreateTableCommandOutput> => {
    if (this.isLocal) {
      return this.commandBus.execute(new CreateTableCommand(command))
    }
    return this.trpc.table.create.mutate(command)
  }

  deleteTable = async (command: IDeleteTableCommand): Promise<void> => {
    if (this.isLocal) {
      return this.commandBus.execute(new DeleteTableCommand(command))
    }
    await this.trpc.table.delete.mutate(command)
  }
}

@injectable()
class DashboardService {
  constructor(
    @injectTrpcClient()
    private readonly trpc: TrpcProxyClient,
    @injectIsLocal()
    private readonly isLocal: boolean,
    @inject(QueryBus)
    private readonly queryBus: IQueryBus,
    @inject(CommandBus)
    private readonly commandBus: ICommandBus,
  ) {}

  getDashboardById = async (query: IGetDashboardByIdQuery): Promise<IGetDashboardByIdOutput> => {
    if (this.isLocal) {
      return await this.queryBus.execute(new GetDashboardByIdQuery(query))
    }
    return (await this.trpc.dashboard.get.query(query)) as IGetDashboardByIdOutput
  }

  getDashboards = async (query: IGetDashboardsQuery): Promise<IGetDashboardsOutput> => {
    if (this.isLocal) {
      return await this.queryBus.execute(new GetDashboardsQuery(query))
    }
    return (await this.trpc.dashboard.list.query(query)) as IGetDashboardsOutput
  }

  addWidget = async (command: IAddDashboardWidgetCommand): Promise<void> => {
    if (this.isLocal) {
      return this.commandBus.execute(new AddDashboardWidgetCommand(command))
    }
    await this.trpc.dashboard.widget.add.mutate(command)
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
    @inject(CommandBus)
    private readonly commandBus: ICommandBus,
  ) {}

  getRecords = async (query: IGetRecordsQuery): Promise<IGetRecordsOutput> => {
    if (this.isLocal) {
      return await this.queryBus.execute(new GetRecordsQuery(query))
    }
    return (await this.trpc.record.list.query(query)) as IGetRecordsOutput
  }

  getRecordById = async (query: IGetRecordByIdQuery): Promise<IGetRecordByIdOutput> => {
    if (this.isLocal) {
      return await this.queryBus.execute(new GetRecordByIdQuery(query))
    }
    return (await this.trpc.record.get.query(query)) as IGetRecordByIdOutput
  }

  getAggregates = async (query: IGetAggregatesQuery): Promise<IGetAggregatesOutput> => {
    if (this.isLocal) {
      return await this.queryBus.execute(new GetAggregatesQuery(query))
    }
    return (await this.trpc.record.aggregate.query(query)) as IGetAggregatesOutput
  }

  createRecord = async (command: ICreateRecordCommand): Promise<ICreateRecordCommandOutput> => {
    if (this.isLocal) {
      return this.commandBus.execute(new CreateRecordCommand(command))
    }
    return this.trpc.record.create.mutate(command)
  }

  createRecords = async (command: ICreateRecordsCommand): Promise<ICreateRecordsCommandOutput> => {
    if (this.isLocal) {
      return this.commandBus.execute(new CreateRecordsCommand(command))
    }
    await this.trpc.record.bulkCreate.mutate(command)
  }

  updateRecord = async (command: IUpdateRecordCommand): Promise<void> => {
    if (this.isLocal) {
      return this.commandBus.execute(new UpdateRecordCommand(command))
    }
    await this.trpc.record.update.mutate(command)
  }

  duplicateRecords = async (command: IBulkDuplicateRecordsCommand): Promise<void> => {
    if (this.isLocal) {
      return this.commandBus.execute(new BulkDuplicateRecordsCommand(command))
    }
    await this.trpc.record.bulkDuplicate.mutate(command)
  }

  deleteRecords = async (command: IBulkDeleteRecordsCommand): Promise<void> => {
    if (this.isLocal) {
      return this.commandBus.execute(new BulkDeleteRecordsCommand(command))
    }
    await this.trpc.record.bulkDelete.mutate(command)
  }

  updateRecords = async (command: IBulkUpdateRecordsCommand): Promise<IBulkUpdateRecordsCommandOutput> => {
    if (this.isLocal) {
      return this.commandBus.execute(new BulkUpdateRecordsCommand(command))
    }
    return this.trpc.record.bulkUpdate.mutate(command)
  }

  triggerRecordButton = async (command: ITriggerRecordButtonCommand): Promise<void> => {
    if (this.isLocal) {
      return this.commandBus.execute(new TriggerRecordButtonCommand(command))
    }
    await this.trpc.record.trigger.mutate(command)
  }
}

@injectable()
export class DataService {
  constructor(
    @injectIsLocal()
    public readonly isLocal: boolean,
    @injectIsPlayground()
    public readonly isPlayground: boolean,
    @injectQueryBuilder()
    public readonly queryBuilder: IQueryBuilder,
    @inject(TemplateService)
    public readonly template: TemplateService,
    @inject(RecordsService)
    public readonly records: RecordsService,
    @inject(BaseService)
    public readonly base: BaseService,
    @inject(TableService)
    public readonly table: TableService,
    @inject(DashboardService)
    public readonly dashboard: DashboardService,
  ) {}
}
