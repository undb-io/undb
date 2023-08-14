import type { IGetTrashRecordsOutput } from '@undb/cqrs'
import { GetTrashRecordsQuery, getTrashRecordsQueryInput } from '@undb/cqrs'
import type { ICommandBus, IQueryBus } from '@undb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'
import { authz } from './authz.middleware.js'

export const createRecordTrashRouter =
  (procedure: typeof publicProcedure) => (commandBus: ICommandBus, queryBus: IQueryBus) =>
    router({
      list: procedure
        .use(authz('record:list_trash'))
        .input(getTrashRecordsQueryInput)
        .output(z.any())
        .query<IGetTrashRecordsOutput>(({ input }) => {
          const query = new GetTrashRecordsQuery(input)
          return queryBus.execute(query)
        }),
    })
