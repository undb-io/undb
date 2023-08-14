import type { IGetRecordAuditsOutput } from '@undb/cqrs'
import { GetRecordAuditsQuery, getRecordAuditsQueryInput } from '@undb/cqrs'
import type { ICommandBus, IQueryBus } from '@undb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'

export const createRecordAuditRouter =
  (procedure: typeof publicProcedure) => (commandBus: ICommandBus, queryBus: IQueryBus) =>
    router({
      list: procedure
        .input(getRecordAuditsQueryInput)
        .output(z.any())
        .query<IGetRecordAuditsOutput>(({ input }) => {
          const query = new GetRecordAuditsQuery(input)
          return queryBus.execute(query)
        }),
    })
