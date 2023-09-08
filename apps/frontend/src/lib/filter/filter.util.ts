import { isOperatorWithoutValue, type IFilter } from '@undb/core'
import { isNil } from 'lodash-es'

export const getValidFilters = (value: Partial<IFilter>[] = []) =>
	value.filter(
		(v) => !!v.path && !!v.operator && !!v.type && (isOperatorWithoutValue(v.operator) ? true : !isNil(v.value)),
	) as IFilter[]
