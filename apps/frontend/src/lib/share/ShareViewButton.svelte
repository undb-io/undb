<script lang="ts">
	import { page } from '$app/stores'
	import { getTable, getView } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import { Button, Input, Popover } from 'flowbite-svelte'
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

	$: if ($getViewShare.isSuccess && !$getViewShare.data.share) {
		$createViewShare.mutate({
			tableId: $table.id.value,
			targetId: $view.id.value,
			targetType: 'view',
			enabled: true,
		})
	}

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
</script>

<Button color="alternative" size="xs" on:click={() => (open = true)}>share</Button>
<Popover bind:open class="w-96 text-sm font-light z-50" title="share" trigger="click" placement="bottom">
	<Input value={url} readonly>
		<svelte:fragment slot="right">
			{#if copied}
				<i class="ti ti-check text-green-500" />
			{:else}
				<i class="ti ti-copy cursor-pointer" on:click={copyURL} />
			{/if}
		</svelte:fragment>
	</Input>
</Popover>
