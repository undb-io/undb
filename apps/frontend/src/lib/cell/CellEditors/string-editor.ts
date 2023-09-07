import type { Edition, RevoGrid } from '@revolist/revogrid/dist/types/interfaces'
import type { VNode } from '@revolist/revogrid/dist/types/stencil-public-runtime'
import delay from 'delay'

export type SaveCallback = (value: Edition.SaveData, preventFocus: boolean) => void

export class StringEditor implements Edition.EditorBase {
	public element: HTMLInputElement | null = null
	public editCell: Edition.EditCell | undefined = undefined

	constructor(
		public column: RevoGrid.ColumnRegular,
		private saveCallback: SaveCallback,
	) {}

	async componentDidRender() {
		await delay(0)
		this.element?.focus()
	}

	private onChange(e: Event) {
		this.element?.blur()
		this.saveCallback((e.target as HTMLInputElement).value, false)
	}

	render(createComponent: RevoGrid.HyperFunc<VNode>) {
		return createComponent('input', {
			onchange: (e: Event) => this.onChange(e),
			class:
				'border-2 border-primary-300 rounded-none text-gray-900 text-sm focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5',
		})
	}
}
