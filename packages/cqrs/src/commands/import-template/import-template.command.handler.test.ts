import { ClsStore, IClsService, IRecordRepository, ITableRepository, UserId } from '@undb/core'
import { TemplateFactory, createTestTemplate, templateInput } from '@undb/template'
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
  const template = createTestTemplate()

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
