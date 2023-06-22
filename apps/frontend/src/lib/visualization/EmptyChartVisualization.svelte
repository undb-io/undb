<script lang="ts">
	import { invalidate } from '$app/navigation'
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import { t } from '$lib/i18n'
	import { createFieldInitial, createFieldModal } from '$lib/store/modal'
	import { getTable, getView } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import { FieldId, type ChartVisualization } from '@undb/core'
	import { Button } from 'flowbite-svelte'

	const table = getTable()
	const view = getView()
	export let visualization: ChartVisualization

	const getChartData = trpc().table.aggregate.chart.query(
		{
			tableId: $table.id.value,
			viewId: $view.id.value,
			visualizationId: visualization.id.value,
		},
		{
			queryHash: visualization.id.value,
			enabled: false,
		},
	)

	const updateVisualization = trpc().table.visualization.update.mutation({
		async onSuccess() {
			await invalidate(`table:${$table.id.value}`)
			await $getChartData.refetch()
		},
	})
</script>

<div {...$$restProps}>
	<div class="flex flex-col justify-center items-center gap-2 h-full">
		<Button
			size="xs"
			color="light"
			class="flex gap-2"
			on:click={() => {
				const fieldId = FieldId.createId()
				$createFieldInitial = {
					id: fieldId,
					type: 'select',
				}
				createFieldModal.open(async () => {
					$updateVisualization.mutate({
						tableId: $table.id.value,
						visualization: {
							id: visualization.id.value,
							type: 'chart',
							fieldId,
							// TODO: select from user input
							chartAggregateFunction: 'count',
						},
					})
				})
			}}
		>
			<i class="ti ti-plus" />
			<span>{$t('Create New Select Field')}</span>
			<FieldIcon type="select" />
		</Button>
	</div>
</div>
