import type { RevoGrid } from '@revolist/revogrid/dist/types/interfaces'
import type { VNode } from '@revolist/revogrid/dist/types/stencil-public-runtime'
import type { CurrencyField, NumberField } from '@undb/core'
import * as numberInput from '@zag-js/number-input'
import delay from 'delay'
import htm from 'htm'
import { BaseEditor, type SaveCallback } from './base-editor'
import { normalizer } from './normalizer'

export class NumberEditor extends BaseEditor<HTMLDivElement, NumberField | CurrencyField> {
	private api: numberInput.Api
	private service: ReturnType<typeof numberInput.machine>

	constructor(
		public column: RevoGrid.ColumnRegular,
		protected saveCallback: SaveCallback,
	) {
		super(column, saveCallback)

		const service = numberInput.machine({
			id: this.column.prop as string,
		})
		this.service = service
		const machine = service.start()

		const api = numberInput.connect(machine.state, machine.send, normalizer)

		this.api = api
	}

	private initElement() {
		const editCell = this.editCell
		if (!editCell) return

		const value = editCell.model[editCell.prop] as string
		this.api.setValue(Number(value))
		this.api.focus()
	}

	async componentDidRender() {
		await delay(0)
		this.initElement()
	}

	disconnectedCallback(): void {
		this.service.stop()
	}

	render(createComponent: RevoGrid.HyperFunc<VNode>) {
		const html = htm.bind(createComponent)
		const api = this.api

		return html`
			<div class="flex items-center" ...${api.rootProps}>
				<input
					type="number"
					...${api.inputProps}
					onchange=${(e: Event) => {
						const value = (e.target as HTMLInputElement).value
						return this.onChange(parseInt(value.replace(/,/g, ''), 10))
					}}
					class="border-2 border-primary-300 rounded-none text-gray-900 text-sm focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
				/>
			</div>
		`
	}
}
