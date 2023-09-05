<script lang="ts">
	import { fieldProxy, type SuperForm } from 'sveltekit-superforms/client'
	import type { UnwrapEffects } from 'sveltekit-superforms'
	import { DEFAULT_TIME_FORMAT, TIME_FORMATS } from '@undb/core'
	import type { Writable } from 'svelte/store'
	import { t } from '$lib/i18n'
	import { Label } from '$components/ui/label'
	import { Switch } from '$components/ui/switch'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { Button } from '$lib/components/ui/button'

	export let form: SuperForm<UnwrapEffects<string>, unknown>
	export let path: any[] = []

	const format = fieldProxy(form.form, [...path, 'timeFormat'] as any) as Writable<string | null>

	let displayTime = !!$format

	$: if (displayTime && !$format) {
		$format = DEFAULT_TIME_FORMAT
	}

	$: if (!displayTime) {
		$format = null
	}

	const formatMap = {
		[TIME_FORMATS[0]]: $t('12 hour'),
		[TIME_FORMATS[1]]: $t('24 hour'),
	}
	const items = TIME_FORMATS.map((format) => ({ value: format, name: formatMap[format] }))
</script>

<div class="flex items-center gap-4 w-full">
	<Label class="flex items-center gap-2">
		<Switch bind:checked={displayTime} />
		{$t('display time')}
	</Label>
	{#if displayTime && $format}
		<Label class="flex items-center flex-1 gap-2">
			<span class="whitespace-nowrap">{$t('Time Format')}</span>

			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button variant="outline" builders={[builder]} {...$$restProps}>
						{$format}
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="w-64">
					<DropdownMenu.RadioGroup bind:value={$format}>
						{#each items as item}
							<DropdownMenu.RadioItem value={item.value}>{item.name}</DropdownMenu.RadioItem>
						{/each}
					</DropdownMenu.RadioGroup>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</Label>
	{/if}
</div>
