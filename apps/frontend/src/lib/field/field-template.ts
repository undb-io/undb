import { currentFieldId, currentFieldMenuRect } from '$lib/store/table'
import { cn } from '$lib/utils'
import type { RevoGrid } from '@revolist/revogrid/dist/types/interfaces'
import type { VNode } from '@revolist/revogrid/dist/types/stencil-public-runtime'
import { AverageField, CountField, MaxField, MinField, ReferenceField, SumField, Table } from '@undb/core'
import htm from 'htm'
import { getIconClass } from './helpers'

type HyperFunc = RevoGrid.HyperFunc<VNode>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
	} else if (
		field instanceof CountField ||
		field instanceof SumField ||
		field instanceof AverageField ||
		field instanceof MinField ||
		field instanceof MaxField
	) {
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

export const getColumnTemplate = (h: HyperFunc, column: RevoGrid.ColumnRegular, readonly = false) => {
	const html = htm.bind(h)

	const getFieldDomId = (fieldId: string | undefined) => (fieldId ? `field_menu_${fieldId}` : undefined)

	return html`
		<div
			class="h-full flex justify-between items-center text-xs text-gray-700 dark:text-gray-50 font-medium dark:hover:bg-gray-700"
		>
			<div class="flex items-center gap-1 flex-1 w-full truncate">
				${column.field.type === 'currency'
					? html`<span class="text-gray-600 text-lg">${column.field.symbol.symbol}</span>`
					: html`<i class="${cn(getIconClass(column.field.type), 'text-gray-600 text-lg dark:text-gray-200')}"></i>`}
				<span title=${column.name} class="flex-1 max-w-full truncate">${column.name}</span>
			</div>
			${readonly
				? ''
				: html`<div class="flex gap-2 items-center flex-grow-0">
						<span> ${getIssue(h, column)} </span>
						<button
							id="${getFieldDomId(column.prop as string | undefined)}"
							onClick=${(e: Event) => {
								currentFieldId.set(column.prop as string)
								const rect = (e.target as HTMLButtonElement).getBoundingClientRect()
								currentFieldMenuRect.set(rect)
							}}
							class="w-[24px] h-[24px] rounded-sm hover:bg-gray-200 dark:hover:bg-gray-600 inline-flex items-center justify-center"
						>
							<i class="ti ti-chevron-down text-gray-500"></i>
						</button>
				  </div>`}
		</div>
	`
}
