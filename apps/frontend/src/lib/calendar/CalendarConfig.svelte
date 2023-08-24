<script lang="ts">
	import { getTable, getView } from '$lib/store/table'
	import { Hr, Radio } from 'flowbite-svelte'
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import { trpc } from '$lib/trpc/client'
	import { writable } from 'svelte/store'
	import { configViewModal, createFieldInitial, createFieldModal } from '$lib/store/modal'
	import { t } from '$lib/i18n'
	import { invalidate } from '$app/navigation'
	import { FieldId } from '@undb/core'
	import { Button } from '$lib/components/ui/button'
	const table = getTable()
	const view = getView()
	$: calendarFields = $table.schema.calendarFields

	const calendarFieldId = writable($view.calendarFieldIdString)
	const setField = trpc().table.view.calendar.setField.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
			$view.calendarFieldIdString = $calendarFieldId
			configViewModal.close()
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
	<div class="my-4">
		<Hr>
			<span class="text-gray-400 text-sm font-normal">{$t('or', { ns: 'common' })}</span>
		</Hr>
	</div>
{/if}

<div class="flex flex-col justify-center gap-2">
	<Button
		size="sm"
		variant="outline"
		class="flex gap-2"
		on:click={() => {
			const id = FieldId.createId()
			$createFieldInitial = {
				id,
				type: 'date',
			}
			createFieldModal.open(async () => {
				$setField.mutate({
					tableId: $table.id.value,
					viewId: $view.id.value,
					field: id,
				})
			})
		}}
	>
		<i class="ti ti-plus" />
		<span>{$t('Create New Date Field')}</span>
		<FieldIcon type="date" />
	</Button>

	<Button
		size="sm"
		variant="outline"
		class="flex gap-2"
		on:click={() => {
			const id = FieldId.createId()
			$createFieldInitial = {
				id,
				type: 'date-range',
			}

			createFieldModal.open(async () => {
				$setField.mutate({
					tableId: $table.id.value,
					viewId: $view.id.value,
					field: id,
				})
			})
		}}
	>
		<i class="ti ti-plus" />
		<span>{$t('Create New Date Range Field')}</span>
		<FieldIcon type="date-range" />
	</Button>
</div>
