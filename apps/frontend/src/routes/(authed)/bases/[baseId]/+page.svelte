<script lang="ts">
	import { Button } from '$components/ui/button'
	import { t } from '$lib/i18n'
	import { confirmDeleteBase, createBaseModal } from '$lib/store/modal'
	import TableCards from '$lib/table/TableCards.svelte'
	import EmptyBase from '$lib/base/EmptyBase.svelte'
	import type { PageData } from './$types'
	import Input from '$components/ui/input/input.svelte'
	import { trpc } from '$lib/trpc/client'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'

	export let data: PageData

	$: base = data.base.base
	let updating = false

	const updateBaseMutation = trpc().base.update.mutation({
		onSuccess(data, variables, context) {
			updating = false
		},
	})

	const updateBase = () => {
		if (!base) return
		$updateBaseMutation.mutate({
			id: base.id,
			name: base.name,
		})
	}
</script>

{#if base}
	<main class="pt-6 h-full flex flex-col">
		<div class="flex justify-between px-10 flex-shrink-0">
			<div class="inline-flex items-center gap-5">
				<Button size="icon" variant="outline" href="/">
					<i class="ti ti-arrow-back-up"></i>
				</Button>
				<div>
					<span class="text-xs text-gray-500">
						{$t('Base', { ns: 'base' })}
					</span>
					{#if updating}
						<Input bind:value={base.name} on:blur={updateBase} class="h-8" autofocus />
					{:else}
						<h6 class="font-semibold leading-6" on:dblclick={() => (updating = true)}>
							{base.name}
						</h6>
					{/if}
				</div>
			</div>

			<div class="flex items-center gap-2">
				<Button variant="outline" class="w-40 gap-2" on:click={() => createBaseModal.open()}>
					<i class="ti ti-plus"></i>
					<span>
						{$t('Create New Base', { ns: 'base' })}
					</span>
				</Button>

				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild let:builder>
						<Button variant="ghost" size="icon" builders={[builder]}>
							<i class="ti ti-dots"></i>
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="w-40">
						<DropdownMenu.Item class="text-red-500 text-xs gap-2" on:click={() => ($confirmDeleteBase = true)}>
							<i class="ti ti-trash"></i>
							<span>
								{$t('Delete Base', { ns: 'base' })}
							</span>
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</div>

		<section class="px-10 py-6 flex-1">
			{#if data.baseTables.length}
				<TableCards tables={data.baseTables} />
			{:else}
				<EmptyBase />
			{/if}
		</section>
	</main>
{/if}
