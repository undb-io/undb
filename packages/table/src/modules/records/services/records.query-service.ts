import { singleton } from "@undb/di"
import type { Option,PaginatedDTO } from "@undb/domain"
import { group } from "radash"
import type { TableDo } from "../../../table.do"
import type { ITableRepository } from "../../../table.repository"
import { injectTableRepository } from "../../../table.repository.provider"
import { type IAttachmentFieldValue } from "../../schema"
import { injectObjectStorage,type IObjectStorage } from "../../storage"
import type {
  AggregateResult,
  ICountRecordsDTO,
  IGetAggregatesDTO,
  IGetPivotDataDTO,
  IGetPivotDataOutput,
  IGetRecordByIdDTO,
  IGetRecordsDTO,
} from "../dto"
import {
  injectRecordQueryRepository,
  type IReadableRecordDTO,
  type IRecordDTO,
  type IRecordQueryRepository,
  type IRecordReadableValueDTO,
} from "../record"
import { countRecords } from "./methods/count-records.method"
import { getAggregates } from "./methods/get-aggregates.method"
import { getPivotData } from "./methods/get-pivot-data.method"
import { getReadableRecordById } from "./methods/get-readable-record-by-id.method"
import { getReadableRecords } from "./methods/get-readable-records.method"
import { getRecordById } from "./methods/get-record-by-id.method"
import { getRecords } from "./methods/get-records.method"

export interface IRecordsQueryService {
  getRecords(query: IGetRecordsDTO): Promise<PaginatedDTO<IRecordDTO>>
  countRecords(query: ICountRecordsDTO): Promise<number>
  getRecordById(query: IGetRecordByIdDTO): Promise<Option<IRecordDTO>>
  getReadableRecords(query: IGetRecordsDTO): Promise<PaginatedDTO<IReadableRecordDTO>>
  getReadableRecordById(query: IGetRecordByIdDTO): Promise<Option<IRecordReadableValueDTO>>
  getAggregates(query: IGetAggregatesDTO): Promise<Record<string, AggregateResult>>
  populateAttachments(dto: IGetRecordsDTO, table: TableDo, records: IRecordDTO[]): Promise<IRecordDTO[]>
  populateAttachment(dto: IGetRecordsDTO, table: TableDo, value: IRecordDTO["values"]): Promise<IRecordDTO["values"]>
  getPivotData(query: IGetPivotDataDTO): Promise<IGetPivotDataOutput>
}

@singleton()
export class RecordsQueryService implements IRecordsQueryService {
  constructor(
    @injectTableRepository()
    readonly tableRepository: ITableRepository,
    @injectRecordQueryRepository()
    readonly repo: IRecordQueryRepository,
    @injectObjectStorage()
    readonly objectStorage: IObjectStorage,
  ) {}

  getRecords = getRecords
  countRecords = countRecords
  getRecordById = getRecordById
  getReadableRecords = getReadableRecords
  getReadableRecordById = getReadableRecordById
  getAggregates = getAggregates
  getPivotData = getPivotData

  async populateAttachments(
    this: RecordsQueryService,
    dto: IGetRecordsDTO,
    table: TableDo,
    records: IRecordDTO[],
  ): Promise<IRecordDTO[]> {
    return Promise.all(
      records.map(async (record) => {
        const values = await this.populateAttachment(dto, table, record.values)
        return {
          ...record,
          values,
        }
      }),
    )
  }

  async populateAttachment(
    this: RecordsQueryService,
    dto: IGetRecordsDTO,
    table: TableDo,
    value: IRecordDTO["values"],
  ): Promise<IRecordDTO["values"]> {
    const fields = table.getSelectFields(undefined, dto.select)
    const attachmentFields = fields.filter((field) => field.type === "attachment")
    if (!attachmentFields.length) {
      return value
    }

    const groupedAttachmentFields = group(attachmentFields, (field) => field.id.value)

    const populate = async (values: IRecordDTO["values"]): Promise<IRecordDTO["values"]> => {
      const populateAttachment = async ([fieldId, value]: [string, any]): Promise<[string, any]> => {
        const attachmentField = groupedAttachmentFields[fieldId]
        if (!attachmentField) {
          return [fieldId, value]
        }

        let attachment = value as IAttachmentFieldValue
        if (!Array.isArray(attachment)) {
          return [fieldId, attachment]
        }

        const v = await Promise.all(
          attachment.map(async (value) => {
            const signedUrl = await this.objectStorage.getPreviewUrl(value.name)
            return { ...value, signedUrl }
          }),
        )
        return [fieldId, v]
      }
      const entries = Object.entries(values)
      return Object.fromEntries(await Promise.all(entries.map(populateAttachment)))
    }

    return populate(value)
  }
}
