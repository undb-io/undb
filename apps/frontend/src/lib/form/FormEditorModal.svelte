<script lang="ts">
	import { formEditorModal } from '$lib/store/modal'
	import { Heading, Input, Modal, Toggle } from 'flowbite-svelte'
	import FormEditor from './FormEditor.svelte'
	import { selectedForm } from '$lib/store/drawer'
	import { t } from '$lib/i18n'
	import { trpc } from '$lib/trpc/client'
	import { getTable } from '$lib/store/table'
	import { getShareFormUrl } from '@undb/integrations'
	import { page } from '$app/stores'
	import ShareDropdown from '$lib/share/ShareDropdown.svelte'
	import { invalidate } from '$app/navigation'
	import type { ChangeEventHandler } from 'svelte/elements'

	const table = getTable()

	$: getShare = trpc().share.get.query(
		{
			tableId: $table.id.value,
			targetId: $selectedForm?.id.value ?? '',
			targetType: 'form',
		},
		{ enabled: !!$selectedForm },
	)

	const updateForm = trpc().table.form.update.mutation({
		async onSuccess(data, variables, context) {
			updating = false
			await invalidate(`table:${$table.id.value}`)
		},
	})

	let updating = false

	const onNameChange = (e: Event) => {
		const target = e.target as HTMLInputElement
		if (!$selectedForm) return

		$updateForm.mutate({
			tableId: $table.id.value,
			formId: $selectedForm.id.value,
			name: target.value,
		})
	}

	const createFormShare = trpc().share.create.mutation({
		async onSuccess(data, variables, context) {
			await $getShare.refetch()
		},
	})

	const updateFormShare = trpc().share.update.mutation({
		async onSuccess(data, variables, context) {
			await $getShare.refetch()
		},
	})
	$: share = $getShare.data?.share ?? null

	$: url = $selectedForm ? getShareFormUrl($page.url.origin, $selectedForm?.id.value) : ''

	const onChange = (e: Event) => {
		const target = e.target as HTMLInputElement
		if (!share && target.checked && $selectedForm) {
			$createFormShare.mutate({
				tableId: $table.id.value,
				targetId: $selectedForm.id.value,
				targetType: 'form',
				enabled: true,
			})
		}
		if (share) {
			$updateFormShare.mutate({
				shareId: share.id,
				update: {
					enabled: target.checked,
				},
			})
		}
	}
</script>

{#if $selectedForm}
	<div id="form-modal">
		<Modal
			class="w-full"
			title={$selectedForm.name.value}
			size="xl"
			placement="top-center"
			bind:open={$formEditorModal.open}
		>
			<svelte:fragment slot="header">
				<div class="flex justify-between w-full gap-2">
					<Heading tag="h6">
						{#if !updating}
							<span on:dblclick={() => (updating = true)}>
								{$selectedForm.name.value}
							</span>
						{:else}
							<Input bind:value={$selectedForm.name.value} on:change={onNameChange} />
						{/if}
					</Heading>
					<Toggle class="inline-flex" checked={share?.enabled ?? false} on:change={onChange}>
						<div class="whitespace-nowrap">
							{$t('share')}
						</div>
					</Toggle>
					<ShareDropdown
						{url}
						{share}
						shareTarget={{ id: $selectedForm.id.value, type: 'form' }}
						trigger="hover"
						onSuccess={async () => {
							await $getShare.refetch()
						}}
					/>
				</div>
			</svelte:fragment>
			<FormEditor />
		</Modal>
	</div>
{/if}

<style>
	:global(#form-modal .max-w-7xl) {
		max-width: 80%;
	}
</style>
