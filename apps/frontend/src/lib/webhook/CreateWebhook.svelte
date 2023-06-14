<script lang="ts">
	import { t } from '$lib/i18n'
	import { createWebhookModal } from '$lib/store/modal'
	import { getTable } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import { EVT_RECORD_CREATED } from '@undb/core'
	import type { createWebhookSchema } from '@undb/integrations'
	import { Button, Input, Label, Modal } from 'flowbite-svelte'
	import { superForm } from 'sveltekit-superforms/client'
	import type { Validation } from 'sveltekit-superforms/index'

	export let data: Validation<typeof createWebhookSchema>

	const table = getTable()

	const createWebhook = trpc().webhook.create.mutation()

	const { form, enhance } = superForm(data, {
		id: 'createWebhook',
		SPA: true,
		dataType: 'json',
		applyAction: true,
		taintedMessage: null,
		async onUpdate(event) {
			$createWebhook.mutate({
				tableId: $table.id.value,
				webhook: {
					enabled: true,
					method: 'POST',
					url: event.form.data.url,
					target: {
						id: $table.id.value,
						type: 'table',
						events: EVT_RECORD_CREATED,
					},
				},
			})
		},
	})
</script>

<Modal class="w-full" bind:open={$createWebhookModal.open}>
	<form id="createWebhook" class="flex gap-2 items-center" method="POST" use:enhance>
		<Label class="flex flex-col gap-2 w-full">
			<div class="flex gap-2 items-center">
				<span>{$t('URL', { ns: 'common' })}</span>
				<span class="text-red-500">*</span>
			</div>

			<Input name="url" size="sm" type="text" bind:value={$form.url} />
		</Label>
	</form>
	<svelte:fragment slot="footer">
		<div class="w-full flex justify-end gap-4">
			<Button size="xs" color="alternative">{$t('Cancel', { ns: 'common' })}</Button>
			<Button size="xs" form="createOption" type="submit">{$t('Confirm', { ns: 'common' })}</Button>
		</div>
	</svelte:fragment>
</Modal>
