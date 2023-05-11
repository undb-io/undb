<script lang="ts">
	import cx from 'classnames'
	import { Button, Radio, Toast } from 'flowbite-svelte'
	import type { NumberVirsualization as CoreNumberVirsualization } from '@undb/core'
	import FieldPicker from '$lib/field/FieldInputs/FieldPicker.svelte'
	import { getTable, getView } from '$lib/store/table'
	import NumberAggregatePicker from '../input/NumberAggregatePicker.svelte'
	import { t } from '$lib/i18n'
	import { trpc } from '$lib/trpc/client'
	import { invalidate } from '$app/navigation'
	import { tick } from 'svelte'
	import { slide } from 'svelte/transition'

	const table = getTable()
	const view = getView()

	export let virsualization: CoreNumberVirsualization

	let mode: 'table' | 'field' = virsualization.fieldId ? 'field' : 'table'

	let fieldId = virsualization.fieldId?.value
	let numberAggregateFunction = virsualization.numberAggregateFunction

	const aggregateNumber = trpc().table.aggregate.aggregateNumber.query(
		{
			tableId: $table.id.value,
			viewId: $view.id.value,
			virsualizationId: virsualization.id.value,
		},
		{
			enabled: false,
		},
	)

	const updateVirsualization = trpc().table.virsualization.update.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
			await $aggregateNumber.refetch()
			await tick()
			fieldId = virsualization.fieldId?.value
			numberAggregateFunction = virsualization.numberAggregateFunction
		},
	})

	$: disabled =
		mode === 'field' &&
		fieldId === virsualization.fieldId?.value &&
		numberAggregateFunction === virsualization.numberAggregateFunction

	const onSubmit = () => {
		if (mode === 'field' && fieldId && numberAggregateFunction) {
			$updateVirsualization.mutate({
				tableId: $table.id.value,
				virsualization: {
					id: virsualization.id.value,
					type: virsualization.type,
					fieldId,
					numberAggregateFunction,
				},
			})
		} else if (mode === 'table') {
			$updateVirsualization.mutate({
				tableId: $table.id.value,
				virsualization: {
					id: virsualization.id.value,
					type: virsualization.type,
				},
			})
		}
	}
</script>

<div {...$$restProps} class={cx('flex flex-col flex-1', $$restProps.class)}>
	<ul
		class="items-center w-full rounded-md border border-gray-200 sm:flex dark:bg-gray-800 dark:border-gray-600 divide-x divide-gray-200 dark:divide-gray-600 mb-4 p-0"
	>
		<li class="w-full">
			<Radio value="table" bind:group={mode} name="mode" custom>
				<div
					role="button"
					class="cursor-pointer rounded-l-md hover:text-white hover:bg-blue-500 w-full h-full px-4 py-2 peer-checked:bg-sky-100 peer-checked:text-blue-600 transition"
				>
					{$t('aggregate mode table')}
				</div>
			</Radio>
		</li>
		<li class="w-full">
			<Radio value="field" bind:group={mode} name="mode" custom>
				<div
					role="button"
					class="cursor-pointer rounded-r-md hover:text-white hover:bg-blue-500 w-full h-full px-4 py-2 peer-checked:bg-sky-100 peer-checked:text-blue-600 transition"
				>
					{$t('aggregate mode field')}
				</div>
			</Radio>
		</li>
	</ul>

	<form on:submit|preventDefault={onSubmit} class="flex flex-col h-full justify-between">
		{#if mode === 'field'}
			<div>
				<FieldPicker
					class="w-full !justify-start mb-4"
					table={$table}
					filter={(f) => f.isNumeric}
					bind:value={fieldId}
				/>
				<NumberAggregatePicker bind:value={numberAggregateFunction} />
			</div>
		{/if}
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
