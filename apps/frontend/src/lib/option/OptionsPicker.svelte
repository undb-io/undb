<script lang="ts">
	import cx from 'classnames'
	import type { SelectField } from '@undb/core'
	import { Button, Dropdown, Checkbox } from 'flowbite-svelte'
	import Option from './Option.svelte'
	import { t } from '$lib/i18n'

	export let field: SelectField

	export let value: string[] | undefined = []

	$: selected = value ? value.map((id) => field.options.getById(id).into()!).filter(Boolean) : []
	$: options = field.options?.options

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
<Dropdown bind:open placement="bottom-start">
	<div class="w-full">
		{#each options as option}
			<Checkbox
				class="cursor-pointer flex "
				bind:group={value}
				value={option.key.value}
				{...$$restProps}
				custom
				on:change={() => (open = false)}
			>
				<span role="button" class="inline-flex w-full px-3 py-2 hover:bg-gray-100 transition">
					<Option {option} />
				</span>
			</Checkbox>
		{/each}
	</div>
</Dropdown>
