<script lang="ts">
	import { t } from '$lib/i18n'
	import { duplicateFieldModal } from '$lib/store/modal'
	import type { Field } from '@undb/core'
	import { Button } from '$components/ui/button'
	import { Switch } from '$lib/components/ui/switch'
	import FieldIcon from './FieldIcon.svelte'
	import { trpc } from '$lib/trpc/client'
	import { invalidate } from '$app/navigation'
	import { getTable } from '$lib/store/table'
	import * as AlertDialog from '$lib/components/ui/alert-dialog'
	import { Label } from '$components/ui/label'
	import { toast } from 'svelte-sonner'
	import { tick } from 'svelte'

	const table = getTable()

	export let field: Field

	let includesValues = false

	const duplicateField = trpc().table.field.duplicate.mutation({
		async onSuccess(data, variables, context) {
			toast.success($t('TABLE.FIELD_DUPLICATED', { ns: 'success', name: $table.name.value }))
			await invalidate(`table:${$table.id.value}`)
			await tick()
			duplicateFieldModal.close()
		},
		onSettled(data, error, variables, context) {
			duplicateFieldModal.close()
		},
		onError(error, variables, context) {
			toast.error(error.message)
		},
	})
</script>

<AlertDialog.Root bind:open={$duplicateFieldModal.open}>
	<AlertDialog.Content class="block space-y-4">
		<AlertDialog.Header>
			<AlertDialog.Title>
				<div class="flex items-center gap-2">
					<p class="text-xl dark:text-white">{$t('Duplicate Field')}</p>
					<FieldIcon type={field.type} />
					<p>{field.name.value}</p>
				</div>
			</AlertDialog.Title>
		</AlertDialog.Header>
		<Label class="inline-flex items-center gap-2">
			<Switch bind:checked={includesValues}></Switch>
			{$t('duplicate field include values')}
		</Label>
		<div class="flex justify-end gap-2">
			<Button size="sm" variant="secondary" on:click={() => duplicateFieldModal.close()}>
				{$t('Cancel', { ns: 'common' })}
			</Button>
			<Button
				size="sm"
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
	</AlertDialog.Content>
</AlertDialog.Root>
