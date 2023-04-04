import type { IFilter } from '@egodb/core'

export const getFilterId = (f: IFilter | null, index: number) => (f?.path.toString() ?? '') + index
