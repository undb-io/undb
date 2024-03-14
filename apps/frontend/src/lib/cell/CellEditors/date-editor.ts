import type { Edition, RevoGrid } from '@revolist/revogrid/dist/types/interfaces'
import { type VNode } from '@revolist/revogrid/dist/types/stencil-public-runtime'
import delay from 'delay'
import htm from 'htm'

export type SaveCallback = (value: Edition.SaveData, preventFocus: boolean) => void

export class DateEditor implements Edition.EditorBase {
	public element: HTMLInputElement | null = null
	public editCell: Edition.EditCell | undefined = undefined

	constructor(
		public column: RevoGrid.ColumnRegular,
		private saveCallback: SaveCallback,
	) {}

	private initElement() {
		const element = this.element
		if (!element) return

		element.focus()

		const editCell = this.editCell
		if (!editCell) return

		element.value = editCell.model[editCell.prop] as string
	}
	async componentDidRender() {
		await delay(0)
		this.initElement()
	}

	private onChange(e: Event) {
		this.element?.blur()
		this.saveCallback((e.target as HTMLInputElement).valueAsDate?.toISOString() ?? '', false)
	}

	render(createComponent: RevoGrid.HyperFunc<VNode>) {
		const html = htm.bind(createComponent)
		return html`
			<input
				type="date"
				onchange=${(e: Event) => this.onChange(e)}
				class="border-2 border-primary-300 rounded-none text-gray-900 text-sm focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
			/>
		`
	}
}
