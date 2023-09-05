<script lang="ts">
	import cx from 'classnames'
	import { Button } from '$lib/components/ui/button'
	import type { ChartVisualization as CoreChartVisualization } from '@undb/core'
	import FieldPicker from '$lib/field/FieldInputs/FieldPicker.svelte'
	import { aggregateChartFn, allTableFields, getTable } from '$lib/store/table'
	import { t } from '$lib/i18n'
	import { trpc } from '$lib/trpc/client'
	import { invalidate } from '$app/navigation'
	import { slide } from 'svelte/transition'
	import Toast from '$components/ui/toast/toast.svelte'

	const table = getTable()

	export let visualization: CoreChartVisualization

	let fieldId = visualization.fieldId?.value

	const getChartData = $aggregateChartFn(visualization)

	const updateVisualization = trpc().table.visualization.update.mutation({
		async onSuccess() {
			await invalidate(`table:${$table.id.value}`)
			await $getChartData.refetch()

			fieldId = visualization.fieldId?.value
		},
	})

	$: disabled = fieldId === visualization.fieldId?.value

	const onSubmit = () => {
		if (fieldId) {
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
		}
	}
</script>

<div {...$$restProps} class={cx('flex flex-col flex-1', $$restProps.class)}>
	<form on:submit|preventDefault={onSubmit} class="flex flex-col h-full justify-between">
		<div>
			<FieldPicker
				fields={$allTableFields}
				filter={(f) =>
					f.type === 'select' || f.type === 'collaborator' || f.type === 'created-by' || f.type === 'updated-by'}
				bind:value={fieldId}
				class="w-full"
			/>
		</div>
		<div class="flex-1" />
		<div class="flex justify-end">
			<Button {disabled} type="submit" size="sm">{$t('Confirm', { ns: 'common' })}</Button>
		</div>
	</form>
</div>

{#if $updateVisualization.isSuccess}
	<Toast class="fixed z-[99999] !bg-green-500 border-0 text-white font-semibold">
		<span class="inline-flex items-center gap-3">
			<i class="ti ti-exclamation-circle text-lg" />
			{$t('update success', { ns: 'common' })}
		</span>
	</Toast>
{/if}
