<script lang="ts">
	import { page } from '$app/stores'
	import { t } from '$lib/i18n'
	import { getTable, getView } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import { Button, Input, Popover, Toggle } from 'flowbite-svelte'
	import { copyText } from 'svelte-copy'

	const table = getTable()
	const view = getView()

	let open = false

	$: getViewShare = trpc().share.get.query(
		{
			tableId: $table.id.value,
			targetId: $view.id.value,
		},
		{ enabled: open },
	)

	const createViewShare = trpc().share.create.mutation({
		async onSuccess(data, variables, context) {
			await $getViewShare.refetch()
		},
	})

	$: share = $getViewShare.data?.share ?? null

	$: url = $page.url.origin + '/s/v/' + $view.id.value

	let copied = false

	const copyURL = () => {
		copyText(url)
		copied = true
		setTimeout(() => {
			copied = false
		}, 2000)
	}

	$: enabled = !!share?.enabled

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
	}
</script>

<Button color="alternative" size="xs" on:click={() => (open = true)}>{$t('share')}</Button>
<Popover bind:open class="w-96 text-sm font-light z-50" title={$t('share')} trigger="click" placement="bottom">
	<div class="space-y-2">
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
	</div>
</Popover>
