<script lang="ts">
	import cx from 'classnames'
	import { invalidate } from '$app/navigation'
	import { t } from '$lib/i18n'
	import { getTable, getView } from '$lib/store/table'
	import { COLS, widgetItems } from '$lib/store/widget'
	import { trpc } from '$lib/trpc/client'
	import { SelectField, type IVisualizationTypeSchema } from '@undb/core'
	import { Button, Dropdown, DropdownItem } from 'flowbite-svelte'

	const table = getTable()
	const view = getView()

	const createWidget = trpc().table.view.dashboard.createWidget.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
			open = false
		},
	})

	let open = false

	const addWidget = (type: IVisualizationTypeSchema) => {
		const newItem = widgetItems.add(type)
		const itemLayout = newItem[COLS]
		const { x, y, h, w } = itemLayout
		const layout = { x, y, h, w }
		return layout
	}

	const addNumbers = async () => {
		const layout = addWidget('number')
		$createWidget.mutate({
			tableId: $table.id.value,
			viewId: $view.id.value,
			widget: {
				layout,
				visualization: {
					name: $t('visualization count'),
					type: 'number',
				},
			},
		})
	}

	const addChart = async () => {
		const layout = addWidget('chart')
		const selectField = $table.schema.fields.find((f) => f instanceof SelectField)
		$createWidget.mutate({
			tableId: $table.id.value,
			viewId: $view.id.value,
			widget: {
				layout,
				visualization: {
					name: $t('visualization bar'),
					type: 'chart',
					chartType: 'bar',
					fieldId: selectField?.id.value,
					chartAggregateFunction: selectField ? 'count' : undefined,
				},
			},
		})
	}
</script>

<Button
	on:click={() => (open = true)}
	size="xs"
	outline
	{...$$restProps}
	class={cx('h-full !rounded-md items-center whitespace-nowrap flex gap-2', $$restProps.class)}
>
	<i class="ti ti-plus" />
	<span>
		{$t('add widget')}
	</span>
</Button>
<Dropdown bind:open class="z-[99999] w-48">
	<DropdownItem class="flex items-center gap-3" on:click={addNumbers}>
		<i class="ti ti-123" />
		<span>{$t('Numbers', { ns: 'common' })}</span>
	</DropdownItem>
	<DropdownItem class="flex items-center gap-3" on:click={addChart}>
		<i class="ti ti-chart-area-line-filled" />
		<span>{$t('Chart', { ns: 'common' })}</span>
	</DropdownItem>
</Dropdown>
