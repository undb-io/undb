<script lang="ts">
	import { getTable, getView } from '$lib/store/table'
	import { Button } from '$components/ui/button'
	import { Separator } from '$lib/components/ui/separator'
	import { Label } from '$lib/components/ui/label'
	import * as RadioGroup from '$lib/components/ui/radio-group'
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import { trpc } from '$lib/trpc/client'
	import { writable } from 'svelte/store'
	import { configViewModal, createFieldInitial, createFieldModal } from '$lib/store/modal'
	import { t } from '$lib/i18n'
	import { invalidate } from '$app/navigation'
	import { FieldId } from '@undb/core'
	import { hasPermission } from '$lib/store/authz'

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
	const onChange = async (value: string | undefined) => {
		if (value) {
			$setField.mutate({
				tableId: $table.id.value,
				viewId: $view.id.value,
				field: value,
			})
		}
	}
</script>

<div class="flex flex-col space-y-2">
	<RadioGroup.Root bind:value={$ganttField} disabled={!$hasPermission('table:set_view_field')} onValueChange={onChange}>
		{#each ganttFields as field}
			<Label class="flex items-center gap-2">
				<RadioGroup.Item value={field.id.value} id={field.id.value} name="calendarFieldId" />
				<FieldIcon type={field.type} />
				<span>{field.name.value}</span>
			</Label>
		{/each}
	</RadioGroup.Root>
</div>

{#if ganttFields.length}
	<div>
		<Separator class="my-4" />
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
		<FieldIcon type="select" />
	</Button>
</div>
