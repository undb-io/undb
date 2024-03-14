import type { Edition, RevoGrid } from '@revolist/revogrid/dist/types/interfaces'
import type { VNode } from '@revolist/revogrid/dist/types/stencil-public-runtime'
import type { BaseField } from '@undb/core'
import { isEmpty } from 'lodash-es'
import { toast } from 'svelte-sonner'

export type SaveCallback = (value: any, preventFocus: boolean) => void

export abstract class BaseEditor<E extends Element, T extends BaseField> implements Edition.EditorBase {
	element?: E | null | undefined
	editCell?: Edition.EditCell | undefined

	constructor(
		public column: RevoGrid.ColumnRegular,
		protected saveCallback: SaveCallback,
	) {}

	protected get field(): T {
		return this.column.field as T
	}

	// TODO: describe type
	onChange<V = unknown>(value: V) {
		// TODO: better check updates
		if (value === this.editCell?.model[this.editCell.prop]) {
			return
		}

		if (this.field.required && isEmpty(value)) {
			return
		}

		const result = this.field.valueSchema.safeParse(value)
		if (result.success) {
			this.saveCallback(result.data, false)
		} else {
			toast.warning(result.error.flatten((i) => i.message).formErrors.join('\n'))
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	render(createElement?: RevoGrid.HyperFunc<VNode> | undefined): string | void | VNode | VNode[] {}
}
