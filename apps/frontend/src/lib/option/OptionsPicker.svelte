<script lang="ts">
	import { cn } from '$lib/utils'
	import type { MultiSelectField, SelectField } from '@undb/core'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { Button } from '$lib/components/ui/button'
	import Option from './Option.svelte'
	import { t } from '$lib/i18n'
	import Label from '$components/ui/label/label.svelte'

	export let field: SelectField | MultiSelectField | undefined
	export let readonly: boolean = false

	export let value: string[] | undefined = []
	$: if (!value) {
		value = []
	}

	$: selected = Array.isArray(value) ? value.map((id) => field?.options.getById(id).into()!).filter(Boolean) : []
	$: options = field?.options?.options ?? []
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button class={cn('h-full', $$restProps.class)} variant="outline" disabled={readonly} builders={[builder]}>
			{#if selected.length}
				<span class="inline-flex gap-2">
					{#each selected as option}
						<Option {option} />
					{/each}
				</span>
			{:else}
				<span class="inline-flex items-center gap-2">
					<i class="ti ti-list-check" />
					<span>{$t('Select Option')}</span>
				</span>
			{/if}
		</Button>
	</DropdownMenu.Trigger>
	{#if !readonly}
		<DropdownMenu.Content class="w-56">
			{#each options as option}
				{@const isSelected = value?.includes(option.key.value)}
				<DropdownMenu.Item
					class="cursor-pointer flex"
					{...$$restProps}
					on:click={(e) => {
						e.preventDefault()
					}}
				>
					<Label role="button" class="flex justify-between w-full hover:bg-gray-100 dark:hover:bg-gray-400 transition">
						<div>
							<input type="checkbox" bind:group={value} value={option.key.value} class="hidden" />
							<Option {option} />
						</div>
						{#if isSelected}
							<i class="ti ti-check"></i>
						{/if}
					</Label>
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Content>
	{/if}
</DropdownMenu.Root>
