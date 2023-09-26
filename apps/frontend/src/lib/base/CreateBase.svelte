<script lang="ts">
	import { goto, invalidate } from '$app/navigation'
	import { Button } from '$components/ui/button'
	import Input from '$components/ui/input/input.svelte'
	import Label from '$components/ui/label/label.svelte'
	import * as Dialog from '$lib/components/ui/dialog'
	import TablesPicker from '$lib/field/FieldInputs/TablesPicker.svelte'
	import { t } from '$lib/i18n'
	import { createBaseModal } from '$lib/store/modal'
	import { trpc } from '$lib/trpc/client'
	import { BaseId, createBaseSchema } from '@undb/core'

	let name = ''
	let tableIds: string[] = []

	$: valid = createBaseSchema.safeParse({ name }).success

	const createBaseMutation = trpc().base.create.mutation({
		async onSuccess(data, variables, context) {
			await invalidate('bases')
			createBaseModal.close()
			await goto(`/bases/${variables.id}`)
		},
	})

	const onSubmit = (e: Event) => {
		e.preventDefault()

		$createBaseMutation.mutate({
			id: BaseId.createId(),
			name,
			tableIds,
		})
	}
</script>

<Dialog.Root bind:open={$createBaseModal.open}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>
				{$t('Create New Base', { ns: 'base' })}
			</Dialog.Title>
		</Dialog.Header>

		<form action="POST" id="createBase" on:submit={onSubmit}>
			<div class="space-y-2">
				<Label class="block space-y-2">
					<span>
						{$t('Name', { ns: 'common' })}
					</span>
					<Input bind:value={name} placeholder={$t('Base Name Placeholder', { ns: 'base' })} />
				</Label>

				<Label class="block space-y-2">
					<div>
						{$t('Tables')}
					</div>
					<TablesPicker bind:value={tableIds} class="w-full" />
				</Label>
			</div>
		</form>

		<Dialog.Footer>
			<div class="w-full flex justify-end gap-4 mt-4">
				<Button size="sm" type="button" variant="secondary">{$t('Cancel', { ns: 'common' })}</Button>
				<Button size="sm" form="createBase" type="submit" disabled={!valid}>{$t('Confirm', { ns: 'common' })}</Button>
			</div>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
