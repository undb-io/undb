import { injectBaseQueryRepository, type IBaseDTO, type IBaseQueryRepository } from "@undb/base"
import { injectDashboardQueryRepository, type IDashboardDTO, type IDashboardQueryRepository } from "@undb/dashboard"
import { inject, singleton } from "@undb/di"
import { None, Option, Some, type IPagination, type PaginatedDTO } from "@undb/domain"
import {
  RecordIdVO,
  TableComositeSpecification,
  TableDo,
  TableIdSpecification,
  TableIdVo,
  WithFormIdSpecification,
  WithViewIdSpecification,
  buildQuery,
  injectRecordQueryRepository,
  injectRecordsQueryService,
  injectTableQueryRepository,
  injectTableRepository,
  withUniqueTable,
  type IGetPivotDataDTO,
  type IGetPivotDataOutput,
  type IRecordDTO,
  type IRecordQueryRepository,
  type IRecordsQueryService,
  type ITableDTO,
  type ITableQueryRepository,
  type ITableRepository,
  type IViewFilterGroup,
  type SingleQueryArgs,
} from "@undb/table"
import { match } from "ts-pattern"
import type { IDisableShareDTO, IEnableShareDTO, IShareDTO } from "../dto"
import type { IShareTarget } from "../share-target.vo"
import { ShareFactory } from "../share.factory"
import {
  injectShareQueryRepository,
  injectShareRepository,
  type IShareQueryRepository,
  type IShareRepository,
} from "../share.repository"
import { WithShareId, withShare } from "../specifications"

export interface IShareService {
  enableShare(dto: IEnableShareDTO): Promise<void>
  disableShare(dto: IDisableShareDTO): Promise<void>
  getShare(id: string): Promise<Option<IShareDTO>>
  getShareByTarget(target: IShareTarget, spaceId: string): Promise<Option<IShareDTO>>
  getBaseByShare(id: string): Promise<IBaseDTO>
  getDashboardByShare(id: string): Promise<IDashboardDTO>
  getTableByShare(id: string): Promise<ITableDTO>
  getTableByShareBase(shareId: string, tableId: string): Promise<ITableDTO>
  getTableByShareDashboard(shareId: string, tableId: string): Promise<ITableDTO>
  getShareRecords(
    shareId: string,
    tableId?: string,
    viewId?: string,
    q?: string,
    filters?: IViewFilterGroup,
    select?: string[],
    pagination?: IPagination,
  ): Promise<PaginatedDTO<IRecordDTO>>
  getSharePivotData(shareId: string, dto: IGetPivotDataDTO): Promise<IGetPivotDataOutput>
  getShareRecordById(id: string, recordId: string, tableId?: string, viewId?: string): Promise<Option<IRecordDTO>>
}

export const SHARE_SERVICE = Symbol.for("SHARE_SERVICE")
export const injectShareService = () => inject(SHARE_SERVICE)

@singleton()
export class ShareService implements IShareService {
  constructor(
    @injectShareRepository()
    private readonly repo: IShareRepository,
    @injectShareQueryRepository()
    private readonly queryRepo: IShareQueryRepository,
    @injectTableQueryRepository()
    private readonly tableQueryRepo: ITableQueryRepository,
    @injectBaseQueryRepository()
    private readonly baseQueryRepo: IBaseQueryRepository,
    @injectTableRepository()
    private readonly tableRepo: ITableRepository,
    @injectRecordsQueryService()
    private readonly recordsService: IRecordsQueryService,
    @injectRecordQueryRepository()
    private readonly recordRepo: IRecordQueryRepository,
    @injectDashboardQueryRepository()
    private readonly dashboardQueryRepo: IDashboardQueryRepository,
  ) {}

  async enableShare(dto: IEnableShareDTO): Promise<void> {
    const spec = withShare(dto.target.type, dto.target.id)

    let share = (await this.repo.findOne(spec)).into(undefined)
    if (!share) {
      share = ShareFactory.create(WithShareId.create(), spec)
    }

    const s = share.$enable(dto)

    if (s.isSome()) {
      await this.repo.updateOneById(share, s.unwrap())
    }
  }

  async disableShare(dto: IEnableShareDTO): Promise<void> {
    const spec = withShare(dto.target.type, dto.target.id)

    let share = (await this.repo.findOne(spec)).into(undefined)
    if (!share) {
      return
    }

    const s = share.$disable(dto)

    if (s.isSome()) {
      await this.repo.updateOneById(share, s.unwrap())
    }
  }

  async getShare(id: string): Promise<Option<IShareDTO>> {
    return this.queryRepo.findOne(WithShareId.fromString(id))
  }

  async getShareByTarget(target: IShareTarget, spaceId: string): Promise<Option<IShareDTO>> {
    const spec = withShare(target.type, target.id)

    return this.queryRepo.findOne(spec)
  }

  async getBaseByShare(id: string): Promise<IBaseDTO> {
    const share = (await this.repo.findOneById(id)).expect("share not found")
    if (share.target.type !== "base") {
      throw new Error("invalid share target")
    }

    return (await this.baseQueryRepo.findOneById(share.target.id)).expect("base not found")
  }

  async getDashboardByShare(id: string): Promise<IDashboardDTO> {
    const share = (await this.repo.findOneById(id)).expect("share not found")
    if (share.target.type !== "dashboard") {
      throw new Error("invalid share target")
    }

    return (await this.dashboardQueryRepo.findOneById(share.target.id)).expect("dashboard not found")
  }

  async getTableByShareBase(shareId: string, tableId: string): Promise<ITableDTO> {
    const share = (await this.repo.findOneById(shareId)).expect("share not found")
    if (share.target.type !== "base") {
      throw new Error("invalid share target")
    }

    return (await this.tableQueryRepo.findOneById(new TableIdVo(tableId))).expect("table not found")
  }

  async getTableByShareDashboard(shareId: string, tableId: string): Promise<ITableDTO> {
    const share = (await this.repo.findOneById(shareId)).expect("share not found")
    if (share.target.type !== "dashboard") {
      throw new Error("invalid share target")
    }

    return (await this.tableQueryRepo.findOneById(new TableIdVo(tableId))).expect("table not found")
  }

  async getTableByShare(id: string): Promise<ITableDTO> {
    const share = (await this.repo.findOneById(id)).expect("share not found")

    const spec = match(share.target.type)
      .returnType<TableComositeSpecification>()
      .with("form", () => new WithFormIdSpecification(share.target.id))
      .with("view", () => new WithViewIdSpecification(share.target.id))
      .otherwise(() => {
        throw new Error("invalid share target")
      })

    return (await this.tableQueryRepo.findOne(spec)).expect("table not found")
  }

  async getSharePivotData(shareId: string, dto: IGetPivotDataDTO): Promise<IGetPivotDataOutput> {
    const share = (await this.repo.findOneById(shareId)).expect("share not found")
    if (share.target.type !== "view") {
      throw new Error("invalid share target")
    }

    const spec = withUniqueTable(dto).expect("invalid unique table specification")
    const table = (await this.tableRepo.findOne(Some(spec))).expect("table not found")
    const view = table.views.getViewById(share.target.id)
    if (!view) {
      throw new Error("view not found")
    }

    return this.recordsService.getPivotData({ tableId: table.id.value, viewId: view.id.value })
  }

  async getShareRecords(
    shareId: string,
    tableId?: string,
    viewId?: string,
    q?: string,
    filters?: IViewFilterGroup,
    select?: string[],
    pagination?: IPagination,
  ): Promise<PaginatedDTO<IRecordDTO>> {
    const share = (await this.repo.findOneById(shareId)).expect("share not found")

    const getData = async (table: TableDo, viewId?: string) => {
      const view = table.views.getViewById(viewId)
      const query = buildQuery(table, { viewId: view.id.value, q, filters, select, pagination })
      const records = await this.recordRepo.find(table, view, query)

      return {
        ...records,
        values: await this.recordsService.populateAttachments({ viewId: view.id.value }, table, records.values),
      }
    }

    if (share.target.type === "base") {
      if (!tableId) {
        throw new Error("tableId is required if share target is base")
      }
      const table = (await this.tableRepo.findOneById(new TableIdVo(tableId))).expect("table not found")
      return getData(table, viewId)
    }

    if (share.target.value.type !== "view") {
      throw new Error("Only view shares are supported")
    }

    const spec = match(share.target.type)
      .returnType<TableComositeSpecification>()
      .with("form", () => new WithFormIdSpecification(share.target.id))
      .with("view", () => new WithViewIdSpecification(share.target.id))
      .otherwise(() => {
        throw new Error("invalid share target")
      })

    const table = (await this.tableRepo.findOne(Some(spec))).expect("table not found")
    return getData(table, share.target.id)
  }

  async getShareRecordById(
    id: string,
    recordId: string,
    tableId?: string,
    viewId?: string,
  ): Promise<Option<IRecordDTO>> {
    const share = (await this.repo.findOneById(id)).expect("share not found")
    const spec = match(share.target.type)
      .returnType<TableComositeSpecification>()
      .with("form", () => new WithFormIdSpecification(share.target.id))
      .with("view", () => new WithViewIdSpecification(share.target.id))
      .with("base", "dashboard", () => {
        if (!tableId) {
          throw new Error("tableId is required if share target is table")
        }
        return new TableIdSpecification(new TableIdVo(tableId))
      })
      .otherwise(() => {
        throw new Error("invalid share target")
      })

    const table = (await this.tableRepo.findOne(Some(spec))).expect("table not found")
    const view = table.views.getViewById(viewId)

    const query: SingleQueryArgs = {
      select: None,
      view,
    }

    const record = await this.recordRepo.findOneById(table, new RecordIdVO(recordId), Some(query))
    if (record.isNone()) {
      return None
    }

    const r = record.unwrap()
    const values = await this.recordsService.populateAttachment({}, table, r.values)
    return Some({
      ...r,
      values,
    })
  }
}
