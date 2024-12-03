import { Base, injectBaseRepository, WithBaseSpaceId, type IBaseRepository } from "@undb/base"
import { injectDashboardRepository, type IDashboardRepository } from "@undb/dashboard"
import { singleton } from "@undb/di"
import {
  injectRecordsService,
  injectTableRepository,
  RecordDO,
  TableDo,
  type IRecordsService,
  type ITableRepository,
} from "@undb/table"
import type { ICreateFromTemplateDTO } from "../dto"
import { injectTemplateQueryRepository, type ITemplateQueryRepository } from "../template"
import { TemplateFactory, type TemplateDTO } from "../template.factory"

export interface ITemplateService {
  createBase(
    dto: ICreateFromTemplateDTO,
    spaceId: string,
  ): Promise<{ base: Base; tables: { table: TableDo; records: RecordDO[] }[] }[]>
  save(template: TemplateDTO, includeData?: boolean): Promise<void>
}

@singleton()
export class TemplateService implements ITemplateService {
  constructor(
    @injectBaseRepository()
    private readonly baseRepository: IBaseRepository,
    @injectTableRepository()
    private readonly tableRepository: ITableRepository,
    @injectTemplateQueryRepository()
    private readonly templateQueryRepository: ITemplateQueryRepository,
    @injectRecordsService()
    private readonly recordsService: IRecordsService,
    @injectDashboardRepository()
    private readonly dashboardRepository: IDashboardRepository,
  ) {}

  async createBase(
    { id, includeData }: ICreateFromTemplateDTO,
    spaceId: string,
  ): Promise<{ base: Base; tables: { table: TableDo; records: RecordDO[] }[] }[]> {
    const template = (await this.templateQueryRepository.findOneById(id)).expect("template not found")

    const bases = await this.baseRepository.find(new WithBaseSpaceId(spaceId))
    const baseNames = bases.map((base) => base.name.value)
    const result = TemplateFactory.create(template.template.template, baseNames, spaceId)

    await this.save(result, includeData)

    return result
  }

  async save(template: TemplateDTO, includeData: boolean = false): Promise<void> {
    for (const { base, tables, dashboards } of template) {
      await this.baseRepository.insert(base)
      await this.tableRepository.insertMany(tables.map((table) => table.table))
      if (includeData) {
        await this.recordsService.createTablesRecords(tables)
      }
      await this.dashboardRepository.insertMany(dashboards)
    }
  }
}
