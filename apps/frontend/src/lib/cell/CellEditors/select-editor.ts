import type { RevoGrid } from '@revolist/revogrid/dist/types/interfaces'
import type { VNode } from '@revolist/revogrid/dist/types/stencil-public-runtime'
import type { SelectField } from '@undb/core'
import * as combobox from '@zag-js/combobox'
import delay from 'delay'
import htm from 'htm'
import { BaseEditor, type SaveCallback } from './base-editor'
import { normalizer } from './normalizer'

export class SelectEditor extends BaseEditor<HTMLDivElement, SelectField> {
	private api: combobox.Api
	private service: ReturnType<typeof combobox.machine>

	private get options() {
		return this.field.options.options.map((o) => o.toJSON())
	}
	constructor(
		public column: RevoGrid.ColumnRegular,
		protected saveCallback: SaveCallback,
	) {
		super(column, saveCallback)

		const collection = combobox.collection({
			items: this.options,
			itemToValue: (o) => o.key,
			itemToString: (o) => o.name,
		})
		const service = combobox.machine({
			id: this.column.prop as string,
			collection,
		})

		this.service = service
		const machine = service.start()

		const api = combobox.connect(machine.state, machine.send, normalizer)
		this.api = api
	}

	private initElement() {
		const editCell = this.editCell
		if (!editCell) return

		const value = editCell.model[editCell.prop] as string | null
		if (value) {
			this.api.setValue([value])
		}
	}

	disconnectedCallback(): void {
		this.service.stop()
	}

	async componentDidRender() {
		await delay(0)
		this.initElement()
	}

	render(createComponent: RevoGrid.HyperFunc<VNode>) {
		const html = htm.bind(createComponent)
		const { api, options } = this
		return html`
			<div class="relative">
				<div ...${api.rootProps}>
					<label ...${api.labelProps}>Select country</label>
					<div ...${api.controlProps}>
						<input ...${api.inputProps} />
						<button ...${api.triggerProps}>▼</button>
					</div>
					<div ...${api.positionerProps}>
						<ul ...${api.contentProps}>
							${options.map((item) => {
								return html`<li ...${api.getItemProps({ item })}>${item.name}</li>`
							})}
						</ul>
						}
					</div>
				</div>
			</div>
		`
	}
}
