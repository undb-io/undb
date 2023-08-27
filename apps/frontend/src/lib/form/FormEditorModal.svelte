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
	import { Switch } from '$lib/components/ui/switch'
	import { Input } from '$lib/components/ui/input'
	import { Label } from '$lib/components/ui/label'

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
		<Dialog.Root bind:open={$formEditorModal.open} closeOnOutsideClick={false}>
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
									<Switch class="inline-flex" checked={share?.enabled ?? false} on:change={onChange}></Switch>
									<div class="whitespace-nowrap">
										{$t('share')}
									</div>
								</Label>
							</ShareDropdown>
						</div></Dialog.Title
					>
				</Dialog.Header>

				<FormEditor />
			</Dialog.Content>
		</Dialog.Root>
	</div>
{/if}
