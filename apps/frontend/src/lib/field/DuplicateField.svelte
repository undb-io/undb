<script lang="ts">
	import { t } from '$lib/i18n'
	import { duplicateFieldModal } from '$lib/store/modal'
	import type { Field } from '@undb/core'
	import { Button, Modal, Toggle } from 'flowbite-svelte'
	import FieldIcon from './FieldIcon.svelte'
	import { trpc } from '$lib/trpc/client'
	import { invalidate } from '$app/navigation'
	import { getTable } from '$lib/store/table'

	const table = getTable()
	const view = getTable()

	export let field: Field

	let includesValues = false

	const duplicateField = trpc().table.field.duplicate.mutation({
		async onSuccess(data, variables, context) {
			duplicateFieldModal.close()
			await invalidate(`table:${$table.id.value}`)
		},
	})
</script>

<Modal bind:open={$duplicateFieldModal.open} class="w-full" autoclose={false}>
	<svelte:fragment slot="header">
		<div class="flex items-center gap-2">
			<p class="text-xl dark:text-white">{$t('Duplicate Field')}</p>
			<FieldIcon type={field.type} />
			<p>{field.name.value}</p>
		</div>
	</svelte:fragment>
	<Toggle size="small" bind:checked={includesValues}>{$t('duplicate field include values')}</Toggle>
	<div class="flex justify-end gap-2">
		<Button size="xs" color="alternative" outline on:click={() => duplicateFieldModal.close()}>
			{$t('Cancel', { ns: 'common' })}
		</Button>
		<Button
			size="xs"
			color="blue"
			on:click={() =>
				$duplicateField.mutate({
					tableId: $table.id.value,
					id: field.id.value,
					includesValues,
				})}
		>
			{$t('Confirm', { ns: 'common' })}
		</Button>
	</div>
</Modal>
