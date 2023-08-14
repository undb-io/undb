<script lang="ts">
	import { getTable, getView } from '$lib/store/table'
	import { Button, Hr, Radio } from 'flowbite-svelte'
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
	$: kanbanFields = $table.schema.kanbanFields

	const kanbanField = writable($view.kanbanFieldIdString)
	const setField = trpc().table.view.kanban.setField.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
			$view.kanbanFieldIdString = $kanbanField
			configViewModal.close()
		},
	})
	const onChange = async () => {
		if (kanbanField) {
			$setField.mutate({
				tableId: $table.id.value,
				viewId: $view.id.value,
				field: $kanbanField,
			})
		}
	}
</script>

<div class="flex flex-col space-y-2">
	{#each kanbanFields as field}
		<Radio
			bind:group={$kanbanField}
			disabled={!$hasPermission('table:set_view_field')}
			name="kanbanFieldId"
			value={field.id.value}
			on:change={onChange}
			class="space-x-1"
		>
			<FieldIcon type={field.type} />
			<span>{field.name.value}</span>
		</Radio>
	{/each}
</div>

{#if kanbanFields.length}
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
		disabled={!$hasPermission('table:create_field')}
		class="flex gap-2"
		on:click={() => {
			const id = FieldId.createId()
			$createFieldInitial = {
				id,
				type: 'select',
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
		<span>{$t('Create New Select Field')}</span>
		<FieldIcon type="select" />
	</Button>

	<Button
		size="xs"
		color="light"
		class="flex gap-2"
		disabled={!$hasPermission('table:create_field')}
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
</div>
