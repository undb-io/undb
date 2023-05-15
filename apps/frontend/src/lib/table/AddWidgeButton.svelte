<script lang="ts">
	import cx from 'classnames'
	import { invalidate } from '$app/navigation'
	import { t } from '$lib/i18n'
	import { getTable, getView } from '$lib/store/table'
	import { COLS, widgeItems } from '$lib/store/widge'
	import { trpc } from '$lib/trpc/client'
	import { SelectField, type IVirsualizationTypeSchema } from '@undb/core'
	import { Button, Dropdown, DropdownItem } from 'flowbite-svelte'

	const table = getTable()
	const view = getView()

	const createWidge = trpc().table.view.dashboard.createWidge.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
			open = false
		},
	})

	let open = false

	const addWidge = (type: IVirsualizationTypeSchema) => {
		const newItem = widgeItems.add(type)
		const itemLayout = newItem[COLS]
		const { x, y, h, w } = itemLayout
		const layout = { x, y, h, w }
		return layout
	}

	const addNumbers = async () => {
		const layout = addWidge('number')
		$createWidge.mutate({
			tableId: $table.id.value,
			viewId: $view.id.value,
			widge: {
				layout,
				virsualization: {
					name: $t('virsualization count'),
					type: 'number',
				},
			},
		})
	}

	const addChart = async () => {
		const layout = addWidge('chart')
		const selectField = $table.schema.fields.find((f) => f instanceof SelectField)
		$createWidge.mutate({
			tableId: $table.id.value,
			viewId: $view.id.value,
			widge: {
				layout,
				virsualization: {
					name: $t('virsualization bar'),
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
		{$t('add widge')}
	</span>
</Button>
<Dropdown bind:open>
	<DropdownItem class="flex items-center gap-3" on:click={addNumbers}>
		<i class="ti ti-123" />
		<span>{$t('Numbers', { ns: 'common' })}</span>
	</DropdownItem>
	<DropdownItem class="flex items-center gap-3" on:click={addChart}>
		<i class="ti ti-chart-area-line-filled" />
		<span>{$t('Chart', { ns: 'common' })}</span>
	</DropdownItem>
</Dropdown>
