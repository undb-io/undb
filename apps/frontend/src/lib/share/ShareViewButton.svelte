<script lang="ts">
	import { page } from '$app/stores'
	import { getTable, getView } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import { Button, Dropdown, Input, Popover } from 'flowbite-svelte'

	const table = getTable()
	const view = getView()

	let open = false

	const getViewShare = trpc().share.get.query(
		{
			tableId: $table.id.value,
			targetId: $view.id.value,
		},
		{ enabled: false },
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
</script>

<Button>share view</Button>
<Popover bind:open class="w-64 text-sm font-light z-50" title="share" trigger="click" placement="bottom">
	<Input value={$page.url.origin} readonly />
</Popover>
