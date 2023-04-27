<script lang="ts">
	import { createViewOpen } from '$lib/store/modal'
	import { ButtonGroup, Input, Modal } from 'flowbite-svelte'
	import ViewTypeSelector from './ViewTypeSelector.svelte'
	import type { Validation } from 'sveltekit-superforms/index'
	import type { createViewSchema } from '@undb/core'
	import { superForm } from 'sveltekit-superforms/client'
	import { trpc } from '$lib/trpc/client'
	import { page } from '$app/stores'
	import { getTable } from '$lib/store/table'
	import { goto, invalidate } from '$app/navigation'
	import { tick } from 'svelte'

	const table = getTable()

	export let data: Validation<typeof createViewSchema>

	const superFrm = superForm(data, {
		id: 'createView',
		SPA: true,
		applyAction: false,
		resetForm: true,
		dataType: 'json',
		taintedMessage: null,
		async onUpdate(event) {
			await trpc($page).table.view.create.mutate({ tableId: $table.id.value, view: event.form.data })
			await invalidate(`table:${$table.id.value}`)
			await tick()
			goto(`/t/${$table.id.value}/${$table.viewsOrder.last}`)
			$createViewOpen = false
		},
	})

	const { form, enhance } = superFrm
</script>

<Modal
	title="Create New View"
	size="md"
	placement="top-center"
	class="static w-full rounded-sm"
	bind:open={$createViewOpen}
>
	<form method="POST" use:enhance>
		<ButtonGroup class="w-full">
			<ViewTypeSelector bind:value={$form.displayType} />
			<Input bind:value={$form.name} />
		</ButtonGroup>
	</form>
</Modal>
