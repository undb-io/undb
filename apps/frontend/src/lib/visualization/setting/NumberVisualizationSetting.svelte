<script lang="ts">
	import { cn } from '$lib/utils'
	import { Button } from '$lib/components/ui/button'
	import type { NumberVisualization as CoreNumberVisualization } from '@undb/core'
	import FieldPicker from '$lib/field/FieldInputs/FieldPicker.svelte'
	import { allTableFields, getTable } from '$lib/store/table'
	import NumberAggregatePicker from '../input/NumberAggregatePicker.svelte'
	import { t } from '$lib/i18n'
	import { trpc } from '$lib/trpc/client'
	import { invalidate } from '$app/navigation'
	import { tick } from 'svelte'
	import { aggregateNumberFn } from '$lib/store/table'
	import Label from '$components/ui/label/label.svelte'
	import { toast } from 'svelte-sonner'

	const table = getTable()

	export let visualization: CoreNumberVisualization

	let mode: 'table' | 'field' = visualization.fieldId ? 'field' : 'table'

	let fieldId = visualization.fieldId?.value
	let numberAggregateFunction = visualization.numberAggregateFunction

	const aggregateNumber = $aggregateNumberFn(visualization, { enabled: false })

	const updateVisualization = trpc().table.visualization.update.mutation({
		async onSuccess(data, variables, context) {
			toast.success($t('TABLE.VISUALIZATION_UPDATED', { ns: 'success' }))
			await invalidate(`table:${$table.id.value}`)
			await $aggregateNumber.refetch()
			await tick()
			fieldId = visualization.fieldId?.value
			numberAggregateFunction = visualization.numberAggregateFunction
		},
		onError(error, variables, context) {
			toast.error(error.message)
		},
	})

	$: disabled =
		mode === 'field' &&
		fieldId === visualization.fieldId?.value &&
		numberAggregateFunction === visualization.numberAggregateFunction

	const onSubmit = () => {
		if (mode === 'field' && fieldId && numberAggregateFunction) {
			$updateVisualization.mutate({
				tableId: $table.id.value,
				visualization: {
					id: visualization.id.value,
					type: visualization.type,
					fieldId,
					numberAggregateFunction,
				},
			})
		} else if (mode === 'table') {
			$updateVisualization.mutate({
				tableId: $table.id.value,
				visualization: {
					id: visualization.id.value,
					type: visualization.type,
				},
			})
		}
	}
</script>

<div {...$$restProps} class={cn('flex flex-col flex-1', $$restProps.class)}>
	<ul
		class="items-center w-full rounded-md border border-gray-200 sm:flex dark:bg-gray-800 dark:border-gray-600 divide-x divide-gray-200 dark:divide-gray-600 mb-4 p-0"
	>
		<Label class="flex-1">
			<li
				class="inline-block cursor-pointer rounded-l-md hover:text-white hover:bg-primary-500 w-full h-full px-4 py-2 peer-checked:bg-sky-100 peer-checked:text-primary-600 transition"
			>
				<div role="button">
					{$t('aggregate mode table')}
				</div>
				<input class="hidden" type="radio" value="table" bind:group={mode} name="mode" />
			</li>
		</Label>
		<Label class="flex-1">
			<li>
				<div
					role="button"
					class="cursor-pointer rounded-r-md hover:text-white hover:bg-primary-500 w-full h-full px-4 py-2 peer-checked:bg-sky-100 peer-checked:text-primary-600 transition"
				>
					{$t('aggregate mode field')}
				</div>
				<input class="hidden" value="field" type="radio" bind:group={mode} name="mode" />
			</li>
		</Label>
	</ul>

	<form on:submit|preventDefault={onSubmit} class="flex flex-col h-full justify-between">
		{#if mode === 'field'}
			<div class="flex flex-col gap-4">
				<FieldPicker
					fields={$allTableFields}
					filter={(f) =>
						f.type === 'rating' || f.type === 'auto-increment' || f.type === 'number' || f.type === 'currency'}
					bind:value={fieldId}
					class="w-full"
				></FieldPicker>
				<NumberAggregatePicker bind:value={numberAggregateFunction} />
			</div>
		{/if}
		<div class="flex-1" />
		<div class="flex justify-end">
			<Button {disabled} type="submit" size="sm">{$t('Confirm', { ns: 'common' })}</Button>
		</div>
	</form>
</div>
