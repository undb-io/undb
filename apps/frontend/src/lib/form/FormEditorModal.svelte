<script lang="ts">
	import { formEditorModal } from '$lib/store/modal'
	import { Heading, Modal, Toggle } from 'flowbite-svelte'
	import FormEditor from './FormEditor.svelte'
	import { selectedForm } from '$lib/store/drawer'
	import { t } from '$lib/i18n'
	import { trpc } from '$lib/trpc/client'
	import { getTable } from '$lib/store/table'

	const table = getTable()

	$: getShare = trpc().share.get.query(
		{
			tableId: $table.id.value,
			targetId: $selectedForm?.id.value ?? '',
			targetType: 'form',
		},
		{ enabled: !!$selectedForm },
	)

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

	let enabled = false
	$: if (share) {
		enabled = share.enabled
	}

	const onChange = (e: Event) => {
		if (!$selectedForm) return
		const target = e.target as HTMLInputElement

		if (!share && target.checked) {
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
	<Modal
		class="w-full"
		title={$selectedForm.name.value}
		size="lg"
		placement="top-center"
		bind:open={$formEditorModal.open}
	>
		<svelte:fragment slot="header">
			<div class="flex justify-between w-full">
				<Heading tag="h6">{$selectedForm.name.value}</Heading>
				<Toggle class="inline-flex" checked={enabled} on:change={onChange}>
					<div class="whitespace-nowrap">
						{$t('share')}
					</div>
				</Toggle>
			</div>
		</svelte:fragment>
		<FormEditor />
	</Modal>
{/if}
