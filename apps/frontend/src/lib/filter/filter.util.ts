import { isOperatorWithoutValue, type IFilter } from '@undb/core'

export const getValidFilters = (value: Partial<IFilter>[] = []) =>
	value.filter(
		(v) => !!v.path && !!v.operator && !!v.type && (isOperatorWithoutValue(v.operator) ? true : v.value !== undefined),
	) as IFilter[]
