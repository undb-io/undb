import type { Components } from '@revolist/revogrid'
import { ColorEditor } from './color-editor'
import { DateEditor } from './date-editor'
import { EmailEditor } from './email-editor'
import { NumberEditor } from './number-editor'
import { SelectEditor } from './select-editor'
import { StringEditor } from './string-editor'

export const editors: Components.RevoGrid['editors'] = {
	string: StringEditor,
	date: DateEditor,
	email: EmailEditor,
	number: NumberEditor,
	currency: NumberEditor,
	color: ColorEditor,
	select: SelectEditor,
}
