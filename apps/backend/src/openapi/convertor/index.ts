import type { Provider } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import { PostmanCollectionConvertor } from '@undb/openapi'

const POSTMAN_CONVERTOR = Symbol('POSTMAN_CONVERTOR')

export const InjectPostmanConvertor = () => Inject(POSTMAN_CONVERTOR)

export const convertors: Provider[] = [
  {
    provide: POSTMAN_CONVERTOR,
    useClass: PostmanCollectionConvertor,
  },
]
