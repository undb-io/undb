import { currentFieldId } from '$lib/store/table'
import type { RevoGrid } from '@revolist/revogrid/dist/types/interfaces'
import type { VNode } from '@revolist/revogrid/dist/types/stencil-public-runtime'
import { AverageField, CountField, ReferenceField, SumField, Table } from '@undb/core'
import cx from 'classnames'
import htm from 'htm'
import { getIconClass } from './helpers'

type HyperFunc = RevoGrid.HyperFunc<VNode>

const issue = (h: HyperFunc, column: RevoGrid.ColumnRegular, issues: string[]): VNode | VNode[] => {
	const html = htm.bind(h)
	const fieldId = column.field.id.value

	return html`
		<span>
			<i data-tooltip-target=${fieldId} class="ti ti-alert-circle-filled text-lg text-red-400"></i>
		</span>
	`
}

const getIssue = (h: HyperFunc, column: RevoGrid.ColumnRegular) => {
	const field = column.field
	if (field instanceof ReferenceField) {
		const issues = field.issues
		if (issues.length) {
			return issue(
				h,
				column,
				issues.map((issue) => issue.unpack()),
			)
		}
	} else if (field instanceof CountField || field instanceof SumField || field instanceof AverageField) {
		const table = column.table as Table
		const issues = field.getIssues(table.schema.toIdMap())
		if (issues.length) {
			return issue(
				h,
				column,
				issues.map((issue) => issue.unpack()),
			)
		}
	}

	return null
}

export const getColumnTemplate = (h: HyperFunc, column: RevoGrid.ColumnRegular) => {
	const html = htm.bind(h)

	const getFieldDomId = (fieldId: string | undefined) => (fieldId ? `field_menu_${fieldId}` : undefined)

	return html`
		<div class="h-full inline-flex w-full justify-between items-center text-xs text-gray-700 font-medium">
			<span class="inline-flex items-center gap-1">
				${column.field.type === 'currency'
					? html`<span class="text-gray-600 text-lg">${column.field.symbol.symbol}</span>`
					: html`<i class="${cx(getIconClass(column.field.type), 'text-gray-600 text-lg')}"></i>`}
				<span>${column.name}</span>
			</span>
			<span class="inline-flex gap-2 items-center">
				<span> ${getIssue(h, column)} </span>
				<button
					id="${getFieldDomId(column.prop as string | undefined)}"
					onClick=${() => currentFieldId.set(column.prop as string)}
					class="w-[24px] h-[24px] rounded-sm hover:bg-gray-200 inline-flex items-center justify-center"
				>
					<i class="ti ti-chevron-down text-gray-500"></i>
				</button>
			</span>
		</div>
	`
}
