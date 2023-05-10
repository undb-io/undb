<script lang="ts">
	import cx from 'classnames'
	import { Button, Heading, Radio } from 'flowbite-svelte'
	import type { NumberVirsualization } from '@undb/core'
	import FieldPicker from '$lib/field/FieldInputs/FieldPicker.svelte'
	import { getTable } from '$lib/store/table'
	import NumberAggregatePicker from '../input/NumberAggregatePicker.svelte'
	import { t } from '$lib/i18n'
	import { trpc } from '$lib/trpc/client'

	const table = getTable()

	export let virsualization: NumberVirsualization

	let mode: 'table' | 'field' = virsualization.fieldId ? 'field' : 'table'

	let fieldId = virsualization.fieldId?.value
	let numberAggregateFunction = virsualization.numberAggregateFunction

	const updateVirsualization = trpc().table.virsualization.update.mutation()

	const onSubmit = () => {
		if (fieldId && numberAggregateFunction) {
			$updateVirsualization.mutate({
				tableId: $table.id.value,
				virsualization: {
					id: virsualization.id.value,
					type: virsualization.type,
					fieldId,
					numberAggregateFunction,
				},
			})
		}
	}
</script>

<div {...$$restProps} class={cx('flex flex-col flex-1', $$restProps.class)}>
	<div class="grid grid-cols-2 gap-1 mb-4">
		<div class="rounded border border-gray-200 dark:border-gray-700">
			<Radio value="table" bind:group={mode} name="bordered" class="w-full p-2">count table</Radio>
		</div>
		<div class="rounded border border-gray-200 dark:border-gray-700">
			<Radio value="field" bind:group={mode} name="bordered" class="w-full p-2">aggregate field</Radio>
		</div>
	</div>

	{#if mode === 'field'}
		<form on:submit|preventDefault={onSubmit} class="flex flex-col h-full justify-between">
			<div>
				<FieldPicker
					class="w-full !justify-start mb-4"
					table={$table}
					filter={(f) => f.isNumeric}
					bind:value={fieldId}
				/>
				<NumberAggregatePicker bind:value={numberAggregateFunction} />
			</div>
			<div class="flex justify-end">
				<Button type="submit" size="xs">{$t('Confirm', { ns: 'common' })}</Button>
			</div>
		</form>
	{/if}
</div>
