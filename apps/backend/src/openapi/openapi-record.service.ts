import { Injectable } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { RecordFactory, recordReadableMapper, type IQueryRecordSchema, type ITableRepository } from '@undb/core'
import { CreateRecordCommand, CreateRecordsCommand, UpdateRecordCommand, UpdateRecordsCommand } from '@undb/cqrs'
import { openAPIMutateRecordMapper, type IOpenAPIMutateRecordSchema } from '@undb/openapi'
import { InjectTableRepository } from '../core/table/adapters/sqlite/table-sqlite.repository.js'

@Injectable()
export class OpenAPIRecordService {
  constructor(
    @InjectTableRepository()
    private readonly repo: ITableRepository,
    private readonly commandBus: CommandBus,
  ) {}

  public async mapMany(tableId: string, records: IQueryRecordSchema[]) {
    const table = (await this.repo.findOneById(tableId)).unwrap()
    const fields = table.schema.fields

    return records.map((record) =>
      recordReadableMapper(fields, RecordFactory.fromQuery(record, table.schema.toIdMap()).unwrap()),
    )
  }

  public async map(tableId: string, record: IQueryRecordSchema) {
    const table = (await this.repo.findOneById(tableId)).unwrap()
    const fields = table.schema.fields

    return recordReadableMapper(fields, RecordFactory.fromQuery(record, table.schema.toIdMap()).unwrap())
  }

  public async createRecord(tableId: string, id: string | undefined, values: IOpenAPIMutateRecordSchema) {
    const table = (await this.repo.findOneById(tableId)).unwrap()
    const internalValues = openAPIMutateRecordMapper(table, values)
    await this.commandBus.execute(new CreateRecordCommand({ tableId, id, values: internalValues }))
  }

  public async createRecords(tableId: string, records: { id?: string; values: IOpenAPIMutateRecordSchema }[]) {
    const table = (await this.repo.findOneById(tableId)).unwrap()
    const internalRecords = records.map((r) => ({ id: r.id, values: openAPIMutateRecordMapper(table, r.values) })) as [
      { id?: string; values: IOpenAPIMutateRecordSchema },
      ...{ id?: string; values: IOpenAPIMutateRecordSchema }[],
    ]
    await this.commandBus.execute(new CreateRecordsCommand({ tableId, records: internalRecords }))
  }

  public async updateRecord(tableId: string, id: string, values: IOpenAPIMutateRecordSchema) {
    const table = (await this.repo.findOneById(tableId)).unwrap()
    const internalValues = openAPIMutateRecordMapper(table, values)
    await this.commandBus.execute(new UpdateRecordCommand({ tableId, id, values: internalValues }))
  }

  public async updateRecords(tableId: string, records: { id: string; values: IOpenAPIMutateRecordSchema }[]) {
    const table = (await this.repo.findOneById(tableId)).unwrap()
    const internalRecords = records.map((r) => ({ id: r.id, values: openAPIMutateRecordMapper(table, r.values) })) as [
      { id: string; values: IOpenAPIMutateRecordSchema },
      ...{ id: string; values: IOpenAPIMutateRecordSchema }[],
    ]
    await this.commandBus.execute(new UpdateRecordsCommand({ tableId, records: internalRecords }))
  }
}
