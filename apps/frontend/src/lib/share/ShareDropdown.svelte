<script lang="ts">
	import { t } from '$lib/i18n'
	import { getTable } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import { getIframe, type IQueryShare, type IShareTarget } from '@undb/integrations'
	import { Dropdown, Heading, Input, Toggle } from 'flowbite-svelte'
	import { copyText } from 'svelte-copy'

	export let url: string
	export let share: IQueryShare | null
	export let shareTarget: IShareTarget

	export let trigger: 'click' | 'hover' = 'click'
	export let onSuccess: (() => Promise<void> | void) | undefined = undefined

	const table = getTable()

	const createShare = trpc().share.create.mutation({
		async onSuccess(data, variables, context) {
			await onSuccess?.()
		},
	})

	const updateShare = trpc().share.update.mutation({
		async onSuccess(data, variables, context) {
			await onSuccess?.()
		},
	})

	const onChange = (e: Event) => {
		const target = e.target as HTMLInputElement

		if (!share) {
			$createShare.mutate({
				tableId: $table.id.value,
				targetId: shareTarget.id,
				targetType: shareTarget.type,
				enabled: true,
			})
		} else {
			$updateShare.mutate({
				shareId: share.id,
				update: {
					enabled: target.checked,
				},
			})
		}
	}
	export let open = false

	let enabled = false
	$: if (share) {
		enabled = share.enabled
	}

	$: iframe = getIframe(url)

	let copied = false

	const copyURL = () => {
		copyText(url)
		copied = true
		setTimeout(() => {
			copied = false
		}, 2000)
	}

	let iframeCopied = false
	const copyIFrame = () => {
		copyText(iframe)
		iframeCopied = true
		setTimeout(() => {
			iframeCopied = false
		}, 2000)
	}
</script>

<Dropdown
	bind:open
	style="z-index: 50;"
	class="w-96 text-sm font-light border rounded-lg "
	title={$t('share')}
	{trigger}
	placement="bottom"
>
	<div class="space-y-2 p-3">
		<Toggle bind:checked={enabled} on:change={onChange}>{enabled ? $t('disable share') : $t('enable share')}</Toggle>
		{#if share && enabled}
			<Input value={url} readonly>
				<svelte:fragment slot="right">
					{#if copied}
						<i class="ti ti-check text-green-500" />
					{:else}
						<div class="flex items-center gap-2">
							<a href={url} target="_blank">
								<i class="ti ti-external-link cursor-pointer" />
							</a>
							<i class="ti ti-copy cursor-pointer" on:click={copyURL} />
						</div>
					{/if}
				</svelte:fragment>
			</Input>
			<Heading tag="h6">Embed</Heading>
			<Input value={iframe} readonly>
				<svelte:fragment slot="right">
					{#if iframeCopied}
						<i class="ti ti-check text-green-500" />
					{:else}
						<div class="flex items-center gap-2">
							<i class="ti ti-copy cursor-pointer" on:click={copyIFrame} />
						</div>
					{/if}
				</svelte:fragment>
			</Input>
		{/if}
	</div>
</Dropdown>
