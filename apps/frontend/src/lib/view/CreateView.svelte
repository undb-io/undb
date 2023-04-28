<script lang="ts">
	import { createViewOpen } from '$lib/store/modal'
	import { ButtonGroup, Input, Modal, Toast } from 'flowbite-svelte'
	import ViewTypeSelector from './ViewTypeSelector.svelte'
	import type { Validation } from 'sveltekit-superforms/index'
	import type { createViewSchema } from '@undb/core'
	import { superForm } from 'sveltekit-superforms/client'
	import { trpc } from '$lib/trpc/client'
	import { getTable } from '$lib/store/table'
	import { goto, invalidate } from '$app/navigation'
	import { tick } from 'svelte'
	import { slide } from 'svelte/transition'

	const table = getTable()

	export let data: Validation<typeof createViewSchema>

	const createView = trpc.table.view.create.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
			await tick()
			goto(`/t/${$table.id.value}/${$table.viewsOrder.last}`)
			$createViewOpen = false
		},
	})
	const superFrm = superForm(data, {
		id: 'createView',
		SPA: true,
		applyAction: false,
		resetForm: true,
		dataType: 'json',
		taintedMessage: null,
		async onUpdate(event) {
			$createView.mutate({ tableId: $table.id.value, view: event.form.data })
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

{#if $createView.error}
	<Toast transition={slide} position="bottom-right" class="z-[99999] !bg-red-500 border-0 text-white font-semibold">
		<span class="inline-flex items-center gap-3">
			<i class="ti ti-exclamation-circle text-lg" />
			{$createView.error.message}
		</span>
	</Toast>
{/if}
