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
	$: galleryFields = $table.schema.galleryFields

	const galleryField = writable($view.galleryFieldIdString)
	const setField = trpc().table.view.gallery.setField.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
			$view.galleryFieldIdString = $galleryField
			configViewModal.close()
		},
	})
	const onChange = async () => {
		if (galleryField) {
			$setField.mutate({
				tableId: $table.id.value,
				viewId: $view.id.value,
				field: $galleryField,
			})
		}
	}
</script>

<div class="flex flex-col space-y-2">
	{#each galleryFields as field}
		<Radio
			bind:group={$galleryField}
			name="galleryFieldId"
			value={field.id.value}
			on:change={onChange}
			class="space-x-1"
		>
			<FieldIcon type={field.type} />
			<span>{field.name.value}</span>
		</Radio>
	{/each}
</div>

{#if galleryFields.length}
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
				type: 'attachment',
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
		<span>{$t('Create New Attachment Field')}</span>
		<FieldIcon type="attachment" />
	</Button>
</div>
