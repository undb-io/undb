<script lang="ts">
	import cx from 'classnames'
	import { Button, Toast } from 'flowbite-svelte'
	import type { NumberVirsualization as CoreChartVirsualization } from '@undb/core'
	import FieldPicker from '$lib/field/FieldInputs/FieldPicker.svelte'
	import { allTableFields, getTable, getView } from '$lib/store/table'
	import { t } from '$lib/i18n'
	import { trpc } from '$lib/trpc/client'
	import { invalidate } from '$app/navigation'
	import { slide } from 'svelte/transition'

	const table = getTable()
	const view = getView()

	export let virsualization: CoreChartVirsualization

	let fieldId = virsualization.fieldId?.value

	const getChartData = trpc().table.aggregate.chart.query(
		{
			tableId: $table.id.value,
			viewId: $view.id.value,
			virsualizationId: virsualization.id.value,
		},
		{
			queryHash: virsualization.id.value,
		},
	)

	const updateVirsualization = trpc().table.virsualization.update.mutation({
		async onSuccess() {
			await invalidate(`table:${$table.id.value}`)
			await $getChartData.refetch()

			fieldId = virsualization.fieldId?.value
		},
	})

	$: disabled = fieldId === virsualization.fieldId?.value

	const onSubmit = () => {
		if (fieldId) {
			$updateVirsualization.mutate({
				tableId: $table.id.value,
				virsualization: {
					id: virsualization.id.value,
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
				class="w-full !justify-start mb-4"
				table={$table}
				fields={$allTableFields}
				filter={(f) => f.type === 'select' || f.type === 'collaborator'}
				bind:value={fieldId}
			/>
		</div>
		<div class="flex-1" />
		<div class="flex justify-end">
			<Button {disabled} type="submit" size="xs">{$t('Confirm', { ns: 'common' })}</Button>
		</div>
	</form>
</div>

{#if $updateVirsualization.isSuccess}
	<Toast
		transition={slide}
		position="bottom-right"
		class="fixed z-[99999] !bg-green-500 border-0 text-white font-semibold"
	>
		<span class="inline-flex items-center gap-3">
			<i class="ti ti-exclamation-circle text-lg" />
			{$t('update success', { ns: 'common' })}
		</span>
	</Toast>
{/if}
