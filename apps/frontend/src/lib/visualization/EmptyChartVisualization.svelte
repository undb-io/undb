<script lang="ts">
	import { invalidate } from '$app/navigation'
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import { t } from '$lib/i18n'
	import { createFieldInitial, createFieldModal } from '$lib/store/modal'
	import { aggregateChartFn, getTable } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import { FieldId, type ChartVisualization } from '@undb/core'
	import { Button } from '$lib/components/ui/button'

	const table = getTable()
	export let visualization: ChartVisualization

	const getChartData = $aggregateChartFn(visualization, { enabled: false })

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
			size="sm"
			variant="ghost"
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
