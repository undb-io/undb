import type { Edition, RevoGrid } from '@revolist/revogrid/dist/types/interfaces'
import type { VNode } from '@revolist/revogrid/dist/types/stencil-public-runtime'
import type { EmailField } from '@undb/core'
import delay from 'delay'
import htm from 'htm'
import { BaseEditor } from './base-editor'

export class EmailEditor extends BaseEditor<EmailField> {
	public element: HTMLInputElement | null = null
	public editCell: Edition.EditCell | undefined = undefined

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

	render(createComponent: RevoGrid.HyperFunc<VNode>) {
		const html = htm.bind(createComponent)
		return html`
			<input
				onchange=${(e: Event) => this.onChange((e.target as HTMLInputElement).value)}
				placeholder="example@email.com"
				class="border-2 border-primary-300 rounded-none text-gray-900 text-sm focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
			/>
		`
	}
}
