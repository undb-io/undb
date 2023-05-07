<script lang="ts">
	import { getTable, getView } from '$lib/store/table'
	import { Button, Hr, Radio } from 'flowbite-svelte'
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import { trpc } from '$lib/trpc/client'
	import { writable } from 'svelte/store'
	import { configViewOpen, createFieldInitial, createFieldOpen } from '$lib/store/modal'
	import { t } from '$lib/i18n'
	import { invalidate } from '$app/navigation'

	const table = getTable()
	const view = getView()
	$: calendarFields = $table.schema.calendarFields

	const calendarFieldId = writable($view.calendarFieldIdString)
	const setField = trpc().table.view.calendar.setField.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
			$view.calendarFieldIdString = $calendarFieldId
			$configViewOpen = false
		},
	})
	const onChange = async () => {
		if (calendarFieldId) {
			$setField.mutate({
				tableId: $table.id.value,
				viewId: $view.id.value,
				field: $calendarFieldId,
			})
		}
	}
</script>

<div class="flex flex-col space-y-2">
	{#each calendarFields as field}
		<Radio
			bind:group={$calendarFieldId}
			name="calendarFieldId"
			value={field.id.value}
			on:change={onChange}
			class="space-x-1"
		>
			<FieldIcon type={field.type} />
			<span>{field.name.value}</span>
		</Radio>
	{/each}
</div>

{#if calendarFields.length}
	<Hr class="my-6">
		<span class="text-gray-400 text-sm font-normal">{$t('or', { ns: 'common' })}</span></Hr
	>
{/if}

<div class="flex flex-col justify-center gap-2">
	<Button
		size="xs"
		color="light"
		class="flex gap-2"
		on:click={() => {
			$createFieldInitial = {
				type: 'date',
			}
			$createFieldOpen = true
		}}
	>
		<i class="ti ti-plus" />
		<span>{$t('Create New Date Field')}</span>
		<FieldIcon type="date" />
	</Button>

	<Button
		size="xs"
		color="light"
		class="flex gap-2"
		on:click={() => {
			$createFieldInitial = {
				type: 'date-range',
			}
			$createFieldOpen = true
		}}
	>
		<i class="ti ti-plus" />
		<span>{$t('Create New Date Range Field')}</span>
		<FieldIcon type="date-range" />
	</Button>
</div>
