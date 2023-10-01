<script lang="ts">
	import { formEditorModal } from '$lib/store/modal'
	import FormEditor from './FormEditor.svelte'
	import { selectedForm } from '$lib/store/drawer'
	import { t } from '$lib/i18n'
	import { trpc } from '$lib/trpc/client'
	import { getTable } from '$lib/store/table'
	import { getShareFormUrl } from '@undb/integrations'
	import { page } from '$app/stores'
	import ShareDropdown from '$lib/share/ShareDropdown.svelte'
	import { invalidate } from '$app/navigation'
	import * as Dialog from '$lib/components/ui/dialog'
	import { Input } from '$lib/components/ui/input'
	import { Label } from '$lib/components/ui/label'
	import { Button } from '$components/ui/button'
	import { toast } from 'svelte-sonner'

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
			toast.success($t('TABLE.FORM_UPDATED', { ns: 'success', name: variables.name }))
			updating = false
			await invalidate(`table:${$table.id.value}`)
		},
		onError(error, variables, context) {
			toast.error(error.message)
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

	$: share = $getShare.data?.share ?? null

	$: url = $selectedForm ? getShareFormUrl($page.url.origin, $selectedForm?.id.value) : ''
</script>

{#if $selectedForm}
	<div id="form-modal">
		<Dialog.Root bind:open={$formEditorModal.open}>
			<Dialog.Content class="!w-3/4 !max-w-none max-h-[98%] overflow-y-auto">
				<Dialog.Header>
					<Dialog.Title class="pr-8">
						<div class="flex justify-between w-full gap-2">
							<h4>
								{#if !updating}
									<span on:dblclick={() => (updating = true)}>
										{$selectedForm.name.value}
									</span>
								{:else}
									<Input bind:value={$selectedForm.name.value} on:change={onNameChange} />
								{/if}
							</h4>
							<ShareDropdown
								{url}
								{share}
								shareTarget={{ id: $selectedForm.id.value, type: 'form' }}
								trigger="hover"
								onSuccess={async () => {
									await $getShare.refetch()
								}}
							>
								<Label class="inline-flex items-center gap-2">
									<Button variant="secondary" class="gap-2">
										<i class="ti ti-share"></i>
										{$t('share')}
									</Button>
								</Label>
							</ShareDropdown>
						</div>
					</Dialog.Title>
				</Dialog.Header>

				<FormEditor />
			</Dialog.Content>
		</Dialog.Root>
	</div>
{/if}
