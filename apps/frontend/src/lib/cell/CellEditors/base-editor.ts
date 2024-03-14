import type { Edition, RevoGrid } from '@revolist/revogrid/dist/types/interfaces'
import type { VNode } from '@revolist/revogrid/dist/types/stencil-public-runtime'
import type { BaseField } from '@undb/core'
import { isEmpty } from 'lodash-es'
import { toast } from 'svelte-sonner'

export type SaveCallback = (value: any, preventFocus: boolean) => void

export abstract class BaseEditor<T extends BaseField> implements Edition.EditorBase {
	element?: HTMLInputElement | null | undefined
	editCell?: Edition.EditCell | undefined

	constructor(
		public column: RevoGrid.ColumnRegular,
		protected saveCallback: SaveCallback,
	) {}

	protected get field(): T {
		return this.column.field as T
	}

	onChange<V = unknown>(value: V) {
		if (this.field.required && isEmpty(value)) {
			this.element?.blur()
			return
		}

		const result = this.field.valueSchema.safeParse(value)
		if (result.success) {
			this.element?.blur()
			this.saveCallback(result.data, false)
		} else {
			toast.warning(result.error.flatten((i) => i.message).formErrors.join('\n'))
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	render(createElement?: RevoGrid.HyperFunc<VNode> | undefined): string | void | VNode | VNode[] {}
}
