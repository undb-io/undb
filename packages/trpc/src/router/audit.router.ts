import { GetRecordAuditsQuery, getRecordAuditsQueryInput, getRecordAuditsQueryOutput } from '@undb/cqrs'
import type { ICommandBus, IQueryBus } from '@undb/domain'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'

export const createAuditRouter =
  (procedure: typeof publicProcedure) => (commandBus: ICommandBus, queryBus: IQueryBus) =>
    router({
      getRecordAudits: procedure
        .input(getRecordAuditsQueryInput)
        .output(getRecordAuditsQueryOutput)
        .query(({ input }) => {
          const query = new GetRecordAuditsQuery(input)
          return queryBus.execute(query)
        }),
    })
