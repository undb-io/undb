import type { ICommandHandler } from '@egodb/domain/dist'
import { Record } from '../../record'
import type { IRecordRepository } from '../../record/repository'
import type { ICreateTableOutput } from '../create-table'
import type { CreateRecordCommand } from './create-record.comand'

export class CreateRecordCommandHandler implements ICommandHandler<CreateRecordCommand, ICreateTableOutput> {
  constructor(protected readonly repo: IRecordRepository) {}
  async execute(command: CreateRecordCommand): Promise<ICreateTableOutput> {
    const record = Record.create(command)

    await this.repo.insert(record)

    return { id: record.id.value }
  }
}
