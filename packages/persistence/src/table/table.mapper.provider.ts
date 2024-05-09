import { inject } from '@undb/di'
import { TableMapper } from './table.mapper'

export const injectTableMapper = () => inject(TableMapper)
