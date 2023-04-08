import type { IFilter } from '@undb/core'

export const getFilterId = (f: IFilter | null, index: number) => (f?.path.toString() ?? '') + index
