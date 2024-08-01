import { auditDTO, getRecordAuditsDTO } from "@undb/audit"
import { Query, type QueryProps } from "@undb/domain"
import { z } from "@undb/zod"

export const getRecordAuditsQuery = getRecordAuditsDTO

export type IGetRecordAuditsQuery = z.infer<typeof getRecordAuditsQuery>

export const getRecordAuditsOutput = z.object({
  total: z.number(),
  audits: auditDTO.array(),
})

export type IGetRecordAuditsOutput = z.infer<typeof getRecordAuditsOutput>

export class GetRecordAuditsQuery extends Query implements IGetRecordAuditsQuery {
  public readonly recordId: string

  constructor(props: QueryProps<IGetRecordAuditsQuery>) {
    super()
    this.recordId = props.recordId
  }
}
