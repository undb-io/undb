import {
  ResetFieldSortCommand,
  resetFieldSortsCommandInput,
  SetFieldSortCommand,
  setFieldSortsCommandInput,
  SetSortsCommand,
  setSortsCommandInput,
} from '@undb/cqrs'
import type { ICommandBus } from '@undb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'
import { authz } from './authz.middleware.js'

export const createSortRouter = (procedure: typeof publicProcedure) => (commandBus: ICommandBus) =>
  router({
    set: procedure
      .use(authz('table:set_view_sort'))
      .input(setSortsCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new SetSortsCommand(input)
        return commandBus.execute<void>(cmd)
      }),
    setFieldSort: procedure
      .use(authz('table:sort_field'))
      .input(setFieldSortsCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new SetFieldSortCommand(input)
        return commandBus.execute<void>(cmd)
      }),
    resetFieldSort: procedure
      .use(authz('table:sort_field'))
      .input(resetFieldSortsCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new ResetFieldSortCommand(input)
        return commandBus.execute<void>(cmd)
      }),
  })
