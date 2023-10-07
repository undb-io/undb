import { ClsStore, IClsService, IRecordRepository, ITableRepository, UserId } from '@undb/core'
import { ITemplateSchema, TemplateFactory } from '@undb/template'
import { MockProxy, mock } from 'vitest-mock-extended'
import { ImportTemplateCommand } from './import-template.command'
import { ImportTemplateCommandHandler } from './import-template.command.handler'
import { SpyInstance } from 'vitest'

describe('import template command hanlder test ', () => {
  let repo: MockProxy<ITableRepository>
  let recordRepo: MockProxy<IRecordRepository>
  let cls: MockProxy<IClsService<ClsStore>>
  let handler: ImportTemplateCommandHandler
  const userId: UserId = new UserId('user1')
  let spy: SpyInstance
  let tabSpy: SpyInstance
  const templateInput: ITemplateSchema = {
    id: 'tplt1wjru6o',
    name: 'testTable',
    export: {
      tables: [
        {
          id: 'tblsj55f6su',
          name: 'testTable',
          schema: [
            {
              id: 'fldn2672c7n',
              name: 'id',
              display: false,
              required: false,
              type: 'id',
            },
            {
              id: 'fld6elro1gn',
              name: 'name',
              display: true,
              required: false,
              type: 'string',
            },
            {
              id: 'fldkek4etmf',
              name: 'createdAt',
              display: false,
              required: false,
              type: 'created-at',
              format: 'yyyy-MM-dd',
              timeFormat: null,
            },
            {
              id: 'fldx2ekp10u',
              name: 'createdBy',
              display: false,
              required: false,
              type: 'created-by',
            },
            {
              id: 'fldmvgkyxkj',
              name: 'updatedAt',
              display: false,
              required: false,
              type: 'updated-at',
              format: 'yyyy-MM-dd',
              timeFormat: null,
            },
            {
              id: 'fld9v4iiuys',
              name: 'updatedBy',
              display: false,
              required: false,
              type: 'updated-by',
            },
          ],
          views: [
            {
              id: 'viwryu43tdx',
              name: 'testTable',
              showSystemFields: false,
              dashboard: {
                widgets: [],
              },
              displayType: 'grid',
              fieldOptions: {},
              rowHeight: 'short',
            },
          ],
          viewsOrder: ['viwryu43tdx'],
          records: [
            {
              id: 'recidpnmpp6',
              values: {
                fld6elro1gn: 'test data',
              },
            },
          ],
        },
      ],
    },
  }
  const template = TemplateFactory.fromJSON(templateInput)

  beforeEach(() => {
    repo = mock<ITableRepository>()
    recordRepo = mock<IRecordRepository>()
    cls = mock<IClsService<ClsStore>>()
    spy = vi.spyOn(TemplateFactory, 'fromJSON').mockReturnValue(template)
    handler = new ImportTemplateCommandHandler(repo, recordRepo, cls)
    tabSpy = vi.spyOn(template.export, 'toTables')
    cls.get.calledWith('user.userId').mockReturnValue(userId.value)
  })

  test('import template success and includeRecords is false', async () => {
    const command = new ImportTemplateCommand({ template: templateInput })

    await handler.execute(command)

    expect(tabSpy).toHaveBeenCalledOnce()
    expect(repo.insert).toHaveBeenCalledWith(tabSpy.mock.results[0].value[0].table)
    expect(recordRepo.insertMany).not.toHaveBeenCalled()
  })

  test('import template success includeRecords is true', async () => {
    const command = new ImportTemplateCommand({ template: templateInput, includeRecords: true })

    await handler.execute(command)

    expect(tabSpy).toHaveBeenCalledOnce()
    expect(repo.insert).toHaveBeenCalledWith(tabSpy.mock.results[0].value[0].table)
    expect(recordRepo.insertMany).toHaveBeenCalledWith(
      tabSpy.mock.results[0].value[0].table,
      tabSpy.mock.results[0].value[0].records,
    )
  })
})
