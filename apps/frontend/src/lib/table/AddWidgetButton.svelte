<script lang="ts">
	import { t } from '$lib/i18n'
	import { getTable, getView } from '$lib/store/table'
	import { COLS, widgetItems } from '$lib/store/widget'
	import { trpc } from '$lib/trpc/client'
	import { SelectField, type IVisualizationTypeSchema } from '@undb/core'
	import { Button } from '$components/ui/button'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { invalidate } from '$app/navigation'
	import { hasPermission } from '$lib/store/authz'

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

{#if $hasPermission('widget:create')}
	<DropdownMenu.Root bind:open>
		<DropdownMenu.Trigger asChild let:builder>
			<Button builders={[builder]} size="sm" variant="ghost" {...$$restProps} class="gap-2 whitespace-nowrap">
				<i class="ti ti-plus" />
				<span>
					{$t('add widget')}
				</span>
			</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content class="w-48">
			<DropdownMenu.Group>
				<DropdownMenu.Item class="gap-2" on:click={addNumbers}>
					<i class="ti ti-123" />
					<span>{$t('Numbers', { ns: 'common' })}</span>
				</DropdownMenu.Item>
				<DropdownMenu.Item class="gap-2" on:click={addChart}>
					<i class="ti ti-chart-area-line-filled" />
					<span>{$t('Chart', { ns: 'common' })}</span>
				</DropdownMenu.Item>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/if}
