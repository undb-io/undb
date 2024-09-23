import { Base, injectBaseRepository, WithBaseSpaceId, type IBaseRepository } from "@undb/base"
import { singleton } from "@undb/di"
import { createLogger } from "@undb/logger"
import {
  injectRecordRepository,
  injectTableRepository,
  RecordDO,
  TableDo,
  type IRecordRepository,
  type ITableRepository,
} from "@undb/table"
import type { IBaseTemplateDTO } from "../dto"
import { TemplateFactory } from "../template.factory"

export interface ITemplateService {
  createBase(
    dto: IBaseTemplateDTO,
    spaceId: string,
  ): Promise<{ base: Base; tables: { table: TableDo; records: RecordDO[] }[] }[]>
}

@singleton()
export class TemplateService implements ITemplateService {
  private readonly logger = createLogger(TemplateService.name)

  constructor(
    @injectBaseRepository()
    private readonly baseRepository: IBaseRepository,
    @injectTableRepository()
    private readonly tableRepository: ITableRepository,
    @injectRecordRepository()
    private readonly recordRepository: IRecordRepository,
  ) {}

  async createBase(
    dto: IBaseTemplateDTO,
    spaceId: string,
  ): Promise<{ base: Base; tables: { table: TableDo; records: RecordDO[] }[] }[]> {
    this.logger.info(dto)
    const bases = await this.baseRepository.find(new WithBaseSpaceId(spaceId))
    const baseNames = bases.map((base) => base.name.value)
    const result = TemplateFactory.create(dto, baseNames, spaceId)

    for (const { base, tables } of result) {
      await this.baseRepository.insert(base)
      await this.tableRepository.insertMany(tables.map((table) => table.table))
      for (const { table, records } of tables) {
        await this.recordRepository.bulkInsert(table, records)
      }
    }

    return result
  }
}
