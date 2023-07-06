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

	const table = getTable()
	const view = getView()
	$: treeFields = $table.schema.treeFields

	const treeField = writable($view.treeFieldIdString)
	const setField = trpc().table.view.tree.setField.mutation({
		async onSuccess(data, variables, context) {
			$view.treeFieldIdString = $treeField
			await invalidate(`table:${$table.id.value}`)
			configViewModal.close()
		},
	})

	const onChange = async () => {
		if (treeField) {
			$setField.mutate({
				tableId: $table.id.value,
				viewId: $view.id.value,
				field: $treeField,
			})
		}
	}
</script>

<div class="flex flex-col space-y-2">
	{#each treeFields as field}
		<Radio bind:group={$treeField} name="treeFieldId" value={field.id.value} on:change={onChange} class="space-x-1">
			<FieldIcon type={field.type} />
			<span>{field.name.value}</span>
		</Radio>
	{/each}
</div>

{#if treeFields.length}
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
			const id = FieldId.createId()
			$createFieldInitial = {
				id,
				type: 'tree',
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
		<span>{$t('Create New Tree Field')}</span>
		<FieldIcon type="tree" />
	</Button>
</div>
