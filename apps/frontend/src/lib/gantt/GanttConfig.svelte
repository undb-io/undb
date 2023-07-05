<script lang="ts">
	import { getTable, getView } from '$lib/store/table'
	import { Button, Hr, Radio } from 'flowbite-svelte'
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import { trpc } from '$lib/trpc/client'
	import { writable } from 'svelte/store'
	import { configViewModal, createFieldInitial, createFieldModal } from '$lib/store/modal'
	import { t } from '$lib/i18n'
	import { invalidate } from '$app/navigation'

	const table = getTable()
	const view = getView()
	$: ganttFields = $table.schema.ganttFields

	const ganttField = writable($view.ganttFieldIdString)
	const setField = trpc().table.view.gantt.setField.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
			$view.ganttFieldIdString = $ganttField
			configViewModal.close()
		},
	})
	const onChange = async () => {
		if (ganttField) {
			$setField.mutate({
				tableId: $table.id.value,
				viewId: $view.id.value,
				field: $ganttField,
			})
		}
	}
</script>

<div class="flex flex-col space-y-2">
	{#each ganttFields as field}
		<Radio bind:group={$ganttField} name="ganttFieldId" value={field.id.value} on:change={onChange} class="space-x-1">
			<FieldIcon type={field.type} />
			<span>{field.name.value}</span>
		</Radio>
	{/each}
</div>

{#if ganttFields.length}
	<div class="my-4">
		<Hr>
			<span class="text-gray-400 text-sm font-normal">{$t('or', { ns: 'common' })}</span>
		</Hr>
	</div>
{/if}

<div class="flex flex-col justify-center gap-2">
	<Button
		size="xs"
		color="light"
		class="flex gap-2"
		on:click={() => {
			$createFieldInitial = {
				type: 'date-range',
			}
			createFieldModal.open()
		}}
	>
		<i class="ti ti-plus" />
		<span>{$t('Create New Date Range Field')}</span>
		<FieldIcon type="select" />
	</Button>
</div>
