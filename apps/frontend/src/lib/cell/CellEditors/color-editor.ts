import type { RevoGrid } from '@revolist/revogrid/dist/types/interfaces'
import type { VNode } from '@revolist/revogrid/dist/types/stencil-public-runtime'
import type { ColorField } from '@undb/core'
import * as colorPicker from '@zag-js/color-picker'
import delay from 'delay'
import htm from 'htm'
import { BaseEditor, type SaveCallback } from './base-editor'
import { normalizer } from './normalizer'

export class ColorEditor extends BaseEditor<HTMLDivElement, ColorField> {
	private api: colorPicker.Api
	private service: ReturnType<typeof colorPicker.machine>

	constructor(
		public column: RevoGrid.ColumnRegular,
		protected saveCallback: SaveCallback,
	) {
		super(column, saveCallback)

		const service = colorPicker.machine({
			id: this.column.prop as string,
			open: true,
			positioning: {
				strategy: 'fixed',
				placement: 'bottom-start',
			},
		})
		this.service = service
		const machine = service.start()

		const api = colorPicker.connect(machine.state, machine.send, normalizer)
		this.api = api
	}

	private initElement() {
		const editCell = this.editCell
		if (!editCell) return

		const value = editCell.model[editCell.prop] as string
		if (value) {
			const parsed = colorPicker.parse(value)
			this.api.setValue(parsed)
		}
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
			<div ...${api.rootProps}>
				<input ...${api.hiddenInputProps} />

				<div ...${api.controlProps}>
					<button class="w-5 h-5" ...${api.triggerProps}>
						<div ...${api.getTransparencyGridProps({ size: '10px' })} />
						<div ...${api.getSwatchProps({ value: api.value })} />
					</button>
					<input ...${api.getChannelInputProps({ channel: 'hex' })} />
				</div>

				<div ...${api.positionerProps}>
					<div ...${api.contentProps}>
						<div ...${api.getAreaProps()}>
							<div ...${api.getAreaBackgroundProps()} />
							<div ...${api.getAreaThumbProps()} />
						</div>
					</div>
				</div>
			</div>
		`
	}
}
