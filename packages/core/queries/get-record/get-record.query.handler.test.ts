import { None, Some } from 'oxide.ts'
import { mock, MockProxy } from 'vitest-mock-extended'
import { IRecordQueryModel } from '../../record'
import { ITableRepository } from '../../table.repository'
import { GetRecordQuery } from './get-record.query'
import { GetRecordQueryHandler } from './get-record.query.handler'

describe('getRecordQueryHandler', () => {
  let mockTableRepository: MockProxy<ITableRepository>
  let mockRecordQueryModel: MockProxy<IRecordQueryModel>

  beforeAll(() => {
    mockTableRepository = mock<ITableRepository>()
    mockRecordQueryModel = mock<IRecordQueryModel>()
  })

  test('should return record if found', async () => {
    const handler = new GetRecordQueryHandler(mockTableRepository, mockRecordQueryModel)
    mockRecordQueryModel.findOneById.mockResolvedValueOnce(Some({ id: 'record', tableId: 'tableId', values: {} }))

    const record = await handler.execute(new GetRecordQuery({ id: 'record' }))

    expect(mockRecordQueryModel.findOneById).toHaveBeenCalledWith('record')
    expect(mockTableRepository.findOneById).not.toBeCalled()
    expect(record).toMatchInlineSnapshot(`
      {
        "id": "record",
        "tableId": "tableId",
        "values": {},
      }
    `)
  })

  test('should return undefined if not found', async () => {
    const handler = new GetRecordQueryHandler(mockTableRepository, mockRecordQueryModel)
    mockRecordQueryModel.findOneById.mockResolvedValueOnce(None)

    await handler.execute(new GetRecordQuery({ id: 'record' }))

    expect(mockRecordQueryModel.findOneById).toHaveBeenCalledWith('record')
    expect(mockTableRepository.findOneById).not.toBeCalled()
  })
})
