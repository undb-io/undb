import type { Components } from '@revolist/revogrid'
import { DateEditor } from './date-editor'
import { StringEditor } from './string-editor'

export const editors: Components.RevoGrid['editors'] = {
	string: StringEditor,
	date: DateEditor,
}
