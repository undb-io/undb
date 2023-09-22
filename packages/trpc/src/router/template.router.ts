import { ImportTemplateCommand, importTemplateCommandInput } from '@undb/cqrs'
import type { ICommandBus, IQueryBus } from '@undb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'
import { authz } from './authz.middleware.js'

export const createTemplateRouter =
  (procedure: typeof publicProcedure) => (commandBus: ICommandBus, queryBus: IQueryBus) =>
    router({
      import: procedure
        .use(authz('webhook:create'))
        .input(importTemplateCommandInput)
        .output(z.any())
        .mutation(({ input }) => {
          const cmd = new ImportTemplateCommand(input)
          return commandBus.execute(cmd)
        }),
    })
