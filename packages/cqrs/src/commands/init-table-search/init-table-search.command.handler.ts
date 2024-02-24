import type { ISearchService, ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import { InitTableSearchCommand } from './init-table-search.command.js'

export class InitTableSearchCommandHandler implements ICommandHandler<InitTableSearchCommand, void> {
  constructor(
    private readonly searchService: ISearchService,
    private readonly repo: ITableRepository,
  ) {}

  async execute(command: InitTableSearchCommand): Promise<void> {
    const table = (await this.repo.findOneById(command.tableId)).expect(
      `failed to find table ${command.tableId} to init search table`,
    )

    await this.searchService.initSearchForTable(table)
  }
}
