<script lang="ts">
	import { page } from '$app/stores'
	import { t } from '$lib/i18n'
	import { getTable, getView } from '$lib/store/table'
	import { hasPermission } from '$lib/store/authz'
	import { trpc } from '$lib/trpc/client'
	import { getShareViewUrl } from '@undb/integrations'
	import { Button } from 'flowbite-svelte'
	import ShareDropdown from './ShareDropdown.svelte'

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

	$: share = $getViewShare.data?.share ?? null

	$: url = getShareViewUrl($page.url.origin, $view.id.value)
</script>

{#if !$hasPermission('share:enable')}
	<Button
		on:click={() => (open = true)}
		color="alternative"
		size="xs"
		class="dark:hover:bg-gray-800  dark:border-gray-400 dark:text-gray-200">{$t('share')}</Button
	>
	<ShareDropdown
		{url}
		{share}
		trigger="click"
		{open}
		shareTarget={{ id: $view.id.value, type: 'view' }}
		onSuccess={async () => {
			await $getViewShare.refetch()
		}}
	/>
{/if}
