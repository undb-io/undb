<script lang="ts">
	import cx from 'classnames'
	import { t } from '$lib/i18n'
	import { currentRLSS, getTable, listRecordFn } from '$lib/store/table'
	import type { IRLSAction } from '@undb/authz/dist'
	import { Button, TabItem, Toast } from 'flowbite-svelte'
	import { invalidate } from '$app/navigation'
	import FilterEditor from '$lib/filter/FilterEditor.svelte'
	import { trpc } from '$lib/trpc/client'
	import type { IFilter } from '@undb/core'
	import { slide } from 'svelte/transition'
	import RlsList from './RlsList.svelte'

	const table = getTable()

	export let action: IRLSAction

	let filter: IFilter[]

	$: rlss = $currentRLSS.filter((rls) => rls.policy.action === action)

	let createMode = false

	const data = $listRecordFn(undefined, { enabled: false })

	const createRLS = trpc().authz.rls.create.mutation({
		async onSettled(data, error, variables, context) {
			await invalidate(`table:${$table.id.value}`)
			filter = []
			createMode = false
			if ((variables as any).policy.action === 'list') {
				await $data.refetch()
			}
		},
	})
</script>

<TabItem
	open={action === 'list'}
	title={$t(action, { ns: 'authz' })}
	defaultClass={cx({ '!text-gray-400': !rlss.length })}
>
	<div class="space-y-2">
		<RlsList {rlss} />
		{#if createMode}
			<div class="space-y-2 bg-green-50 border border-green-100 p-2 rounded-md">
				<div class="flex items-start w-full gap-2">
					<div class="flex-1 w-full bg-green-100 border border-green-200 p-1 rounded-md">
						<FilterEditor bind:value={filter} let:add>
							<Button on:click={add} class="w-full mt-2" size="xs" color="alternative">{$t('Create New Filter')}</Button
							>
						</FilterEditor>
					</div>
				</div>
				<Button
					class="w-full whitespace-nowrap"
					color="alternative"
					size="xs"
					disabled={$createRLS.isLoading}
					on:click={() => {
						$createRLS.mutate({
							tableId: $table.id.value,
							policy: {
								action,
								filter,
							},
						})
					}}
				>
					{$t('Create New RLS', { ns: 'authz' })}
				</Button>
			</div>
		{:else}
			<div class="w-full">
				<Button
					size="sm"
					on:click={() => (createMode = true)}
					color={rlss.length ? 'alternative' : 'blue'}
					class="w-full">{$t('Create New RLS', { ns: 'authz' })}</Button
				>
			</div>
		{/if}
	</div>
</TabItem>

{#if $createRLS.error}
	<Toast
		transition={slide}
		position="bottom-right"
		class="z-[99999] !bg-red-500 border-0 text-white font-semibold fixed"
	>
		<span class="inline-flex items-center gap-3">
			<i class="ti ti-exclamation-circle text-lg" />
			{$createRLS.error.message}
		</span>
	</Toast>
{/if}
