import { GetRecordAuditsQuery, IGetRecordAuditsOutput, getRecordAuditsQueryInput } from '@undb/cqrs'
import type { ICommandBus, IQueryBus } from '@undb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'

export const createAuditRouter =
  (procedure: typeof publicProcedure) => (commandBus: ICommandBus, queryBus: IQueryBus) =>
    router({
      getRecordAudits: procedure
        .input(getRecordAuditsQueryInput)
        .output(z.any())
        .query<IGetRecordAuditsOutput>(({ input }) => {
          const query = new GetRecordAuditsQuery(input)
          return queryBus.execute(query)
        }),
    })
