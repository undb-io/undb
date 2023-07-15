<script lang="ts">
	import { page } from '$app/stores'
	import { t } from '$lib/i18n'
	import { getTable, getView } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import { Button, Dropdown, Heading, Input, Toggle } from 'flowbite-svelte'
	import { copyText } from 'svelte-copy'

	const table = getTable()
	const view = getView()

	let open = false

	$: getViewShare = trpc().share.get.query(
		{
			tableId: $table.id.value,
			targetId: $view.id.value,
			targetType: 'view',
		},
		{ enabled: open },
	)

	const createViewShare = trpc().share.create.mutation({
		async onSuccess(data, variables, context) {
			await $getViewShare.refetch()
		},
	})

	const updateViewShare = trpc().share.update.mutation({
		async onSuccess(data, variables, context) {
			await $getViewShare.refetch()
		},
	})

	$: share = $getViewShare.data?.share ?? null

	$: url = $page.url.origin + '/s/v/' + $view.id.value
	$: iframe = `<iframe
  src="${url}"
  frameborder="0"
  width="100%"
  height="700"
  style="background: transparent; border: 1px solid #ddd"></iframe>
	`

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

	let enabled = false
	$: if (share) {
		enabled = share.enabled
	}

	const onChange = (e: Event) => {
		const target = e.target as HTMLInputElement
		if (!share && target.checked) {
			$createViewShare.mutate({
				tableId: $table.id.value,
				targetId: $view.id.value,
				targetType: 'view',
				enabled: true,
			})
		}
		if (share) {
			$updateViewShare.mutate({
				shareId: share.id,
				update: {
					enabled: target.checked,
				},
			})
		}
	}
</script>

<Button color="alternative" size="xs" class="dark:hover:bg-gray-800  dark:border-gray-400 dark:text-gray-200"
	>{$t('share')}</Button
>
<Dropdown
	bind:open
	class="w-96 text-sm font-light z-50 border rounded-lg "
	title={$t('share')}
	trigger="click"
	placement="bottom"
>
	<div class="space-y-2 p-3">
		<Toggle bind:checked={enabled} on:change={onChange}>{enabled ? $t('disable share') : $t('enable share')}</Toggle>
		{#if share}
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
		{/if}
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
	</div>
</Dropdown>
