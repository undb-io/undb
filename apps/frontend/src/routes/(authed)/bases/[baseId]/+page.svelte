<script lang="ts">
	import { Button } from '$components/ui/button'
	import { t } from '$lib/i18n'
	import { createBaseModal } from '$lib/store/modal'
	import TableCards from '$lib/table/TableCards.svelte'
	import EmptyBase from '$lib/base/EmptyBase.svelte'
	import type { PageData } from './$types'
	import Input from '$components/ui/input/input.svelte'
	import { trpc } from '$lib/trpc/client'
	import BaseMenu from '$lib/base/BaseMenu.svelte'
	import { hasPermission } from '$lib/store/authz'
	import { createTableModal } from '$lib/store/modal'
	import * as Card from '$components/ui/card'
	import { createTableDefaultValue } from '$lib/store/table'

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
					<i class="ti ti-home"></i>
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
				<Button variant="outline" class="min-w-40 gap-2" on:click={() => createBaseModal.open()}>
					<i class="ti ti-plus"></i>
					<span>
						{$t('Create New Base', { ns: 'base' })}
					</span>
				</Button>

				<BaseMenu />
			</div>
		</div>

		<section class="px-10 py-6 flex-1">
			{#if data.baseTables.length}
				<TableCards tables={data.baseTables}>
					{#if $hasPermission('table:create')}
						<Card.Root
							class="!max-w-none cursor-pointer hover:bg-primary-500/90  hover:shadow-sm transition h-full border border-dashed border-slate-200 hover:border-slate-100"
							on:click={() => {
								createTableDefaultValue.set({
									baseId: base?.id,
								})
								createTableModal.open()
							}}
						>
							<Card.Header>
								<div class="flex items-center gap-2 h-full font-normal text-sm text-gray-500">
									<i class="ti ti-plus" />
									<p>{$t('Create New Table')}</p>
								</div>
							</Card.Header>
						</Card.Root>
					{/if}
				</TableCards>
			{:else}
				<EmptyBase />
			{/if}
		</section>
	</main>
{/if}
