import type { Components } from '@revolist/revogrid'
import { DateEditor } from './date-editor'
import { NumberEditor } from './number-editor'
import { StringEditor } from './string-editor'

export const editors: Components.RevoGrid['editors'] = {
	string: StringEditor,
	date: DateEditor,
	// @ts-expect-error expect number save callback value as number
	number: NumberEditor,
	// @ts-expect-error expect number save callback value as number
	currency: NumberEditor,
}
