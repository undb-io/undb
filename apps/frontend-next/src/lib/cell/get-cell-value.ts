import type { Field, RecordAllValueType, SelectFieldValue } from '@undb/core'

export const getCellValue = (field: Field, value: RecordAllValueType) => {
	switch (field.type) {
		case 'select': {
			const option = (value as SelectFieldValue | undefined)?.getOption(field).into()
			return option
		}

		default:
			throw new Error('not implemented')
	}
}
