import { CreateTableCommand } from '@egodb/core'
import { Body, Controller, Post } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { routesV1 } from '../../../../configs/app.routes'
import { CreateTableRequestDTO } from './create-table.request.dto'

@Controller(routesV1.version)
export class CreateTableRestfulController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(routesV1.table.create)
  async create(@Body() props: CreateTableRequestDTO) {
    const cmd = new CreateTableCommand({ name: props.name })
    await this.commandBus.execute(cmd)
  }
}
