<script lang="ts">
	import cx from 'classnames'
	import type { SelectField } from '@undb/core'
	import { Button, Dropdown, Radio } from 'flowbite-svelte'
	import Option from './Option.svelte'
	import { t } from '$lib/i18n'

	export let field: SelectField

	export let group: string | undefined

	$: option = group ? field.options.getById(group).into() : null
	$: options = field.options?.options

	$: open = false
</script>

<Button class={cx('h-full', $$restProps.class)} color="alternative">
	{#if option}
		<Option {option} />
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
			<Radio
				class="cursor-pointer flex "
				bind:group
				value={option.key.value}
				{...$$restProps}
				custom
				on:change={() => (open = false)}
			>
				<span role="button" class="inline-flex w-full px-3 py-2 hover:bg-gray-100 transition">
					<Option {option} />
				</span>
			</Radio>
		{/each}
	</div>
</Dropdown>
