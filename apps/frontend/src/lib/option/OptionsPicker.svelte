<script lang="ts">
	import cx from 'classnames'
	import type { MultiSelectField, SelectField } from '@undb/core'
	import { Button, Dropdown, Checkbox } from 'flowbite-svelte'
	import Option from './Option.svelte'
	import { t } from '$lib/i18n'

	export let field: SelectField | MultiSelectField | undefined

	export let value: string[] | undefined = []
	$: if (!value) {
		value = []
	}

	$: selected = Array.isArray(value) ? value.map((id) => field?.options.getById(id).into()!).filter(Boolean) : []
	$: options = field?.options?.options ?? []

	$: open = false
</script>

<Button class={cx('h-full', $$restProps.class)} color="alternative">
	{#if selected.length}
		<span class="inline-flex gap-2">
			{#each selected as option}
				<Option {option} />
			{/each}
		</span>
	{:else}
		<span class="inline-flex items-center gap-2">
			<i class="ti ti-plus" />
			<span>{$t('Select Option')}</span>
		</span>
	{/if}
</Button>
<Dropdown style="z-index: 50;" bind:open placement="bottom-start" class="w-full min-w-[200px]">
	<div class="w-full">
		{#each options as option}
			{@const select = selected.some((s) => s.key.value === option.key.value)}
			<Checkbox
				class="cursor-pointer flex "
				bind:group={value}
				value={option.key.value}
				{...$$restProps}
				custom
				on:change={() => (open = false)}
			>
				<span role="button" class="inline-flex justify-between w-full px-3 py-2 hover:bg-gray-100 transition">
					<Option {option} />
					{#if select}
						<i class="ti ti-check" />
					{/if}
				</span>
			</Checkbox>
		{/each}
	</div>
</Dropdown>
