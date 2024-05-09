import { initTRPC } from '@trpc/server'
import { CreateTableCommand, createTableCommand } from '@undb/commands'
import { CommandBus, QueryBus } from '@undb/cqrs'
import { container } from '@undb/di'
import type { ICommandBus, IQueryBus } from '@undb/domain'
import { createLogger } from '@undb/logger'
import { GetTableQuery, GetTablesQuery, getTableQuery } from '@undb/queries'
import { tableDTO } from '@undb/table'
import { z } from 'zod'
import pkg from '../package.json'

const log = createLogger(pkg.name)

const commandBus = container.resolve<ICommandBus>(CommandBus)
const queryBus = container.resolve<IQueryBus>(QueryBus)

const t = initTRPC.create()

const p = t.procedure.use(async ({ type, input, path, next }) => {
  const startTime = performance.now()

  const result = await next()

  const responseTime = performance.now() - startTime

  const meta = {
    responseTime,
    type,
    input,
    path,
  }
  if (result.ok) {
    log.info(meta, `${type}: ${path}`)
  } else {
    log.error({ ...meta, error: result.error })
  }

  return result
})

const tableRouter = t.router({
  list: p
    .input(z.void())
    .output(tableDTO.array())
    .query(() => queryBus.execute(new GetTablesQuery())),
  get: p
    .input(getTableQuery)
    .output(tableDTO)
    .query(({ input }) => queryBus.execute(new GetTableQuery(input))),
  create: p
    .input(createTableCommand)
    .output(z.string())
    .mutation(({ input }) => commandBus.execute(new CreateTableCommand(input))),
})

export const route = t.router({
  table: tableRouter,
})

export type AppRouter = typeof route
