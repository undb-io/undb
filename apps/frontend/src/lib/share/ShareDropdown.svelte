<script lang="ts">
	import { t } from '$lib/i18n'
	import { getTable } from '$lib/store/table'
	import { hasPermission } from '$lib/store/authz'
	import { trpc } from '$lib/trpc/client'
	import { getIframe, type IQueryShare, type IShareTarget } from '@undb/integrations'
	import { Input } from '$lib/components/ui/input'
	import { Label } from '$lib/components/ui/label'
	import { Switch } from '$lib/components/ui/switch'
	import * as Popover from '$lib/components/ui/popover'

	import { copyText } from 'svelte-copy'
	import { Textarea } from '$components/ui/textarea'
	import { toast } from 'svelte-sonner'

	export let url: string
	export let share: IQueryShare | null
	export let shareTarget: IShareTarget

	export let trigger: 'click' | 'hover' = 'click'
	export let onSuccess: (() => Promise<void> | void) | undefined = undefined

	const table = getTable()

	const createShare = trpc().share.create.mutation({
		async onSuccess(data, variables, context) {
			await onSuccess?.()
		},
	})

	const updateShare = trpc().share.update.mutation({
		async onSuccess(data, variables, context) {
			await onSuccess?.()
		},
	})

	const onChange = (checked: boolean | undefined) => {
		if (!share) {
			$createShare.mutate({
				tableId: $table.id.value,
				targetId: shareTarget.id,
				targetType: shareTarget.type,
				enabled: true,
			})
		} else {
			$updateShare.mutate({
				shareId: share.id,
				update: {
					enabled: checked,
				},
			})
		}
	}
	export let open = false

	let enabled = false
	$: if (share) {
		enabled = share.enabled
	}

	$: iframe = getIframe(url)

	let copied = false

	const copyURL = () => {
		copyText(url)
		toast.success($t('COPIED', { ns: 'success' }))
		copied = true
		setTimeout(() => {
			copied = false
		}, 2000)
	}

	let iframeCopied = false
	const copyIFrame = () => {
		copyText(iframe)
		toast.success($t('COPIED', { ns: 'success' }))
		iframeCopied = true
		setTimeout(() => {
			iframeCopied = false
		}, 2000)
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger>
		<slot />
	</Popover.Trigger>
	<Popover.Content class="w-96 z-[999999999999]">
		<div class="space-y-2">
			<Label class="inline-flex items-center gap-2">
				<Switch bind:checked={enabled} disabled={!$hasPermission('share:enable')} onCheckedChange={onChange}></Switch>
				{enabled ? $t('disable share') : $t('enable share')}
			</Label>
			{#if share && enabled}
				<Label class="flex items-center gap-2">
					<Input value={url} readonly on:focus={(e) => e.target.select()}></Input>
					{#if copied}
						<i class="ti ti-check text-green-500" />
					{:else}
						<div class="flex items-center gap-2">
							<a href={url} target="_blank">
								<i class="ti ti-external-link cursor-pointer" />
							</a>
							<i class="ti ti-copy cursor-pointer" on:click={copyURL} />
						</div>
					{/if}
				</Label>
				<h5>{$t('Embed', { ns: 'common' })}</h5>
				<div class="flex items-center gap-2">
					<Textarea value={iframe} readonly on:focus={(e) => e.target.select()} />
					{#if iframeCopied}
						<i class="ti ti-check text-green-500" />
					{:else}
						<div class="flex items-center gap-2">
							<i class="ti ti-copy cursor-pointer" on:click={copyIFrame} />
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</Popover.Content>
</Popover.Root>
