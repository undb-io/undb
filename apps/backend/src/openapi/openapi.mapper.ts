import { Inject, Provider } from '@nestjs/common'
import { openApiRecordMapper } from '@undb/openapi'

const OPEN_API_MAPPER = Symbol('OPEN_API_MAPPER')

export const InjectOpenAPIMapper = () => Inject(OPEN_API_MAPPER)

export const provider: Provider = {
  provide: OPEN_API_MAPPER,
  useValue: openApiRecordMapper,
}
