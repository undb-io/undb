import type { IFilter } from '@egodb/core'

export const getFilterId = (f: IFilter | null) => (f ? f.path.toString() + f.type + f.operator : '')
