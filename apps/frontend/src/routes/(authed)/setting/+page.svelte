<script lang="ts">
	import Button from '$components/ui/button/button.svelte'
	import { t } from '$lib/i18n'
	import { trpc } from '$lib/trpc/client'

	const createToken = trpc().openapi.apiToken.create.mutation({})
</script>

<div>
	<div class="flex justify-end">
		<Button class="w-40 gap-2" on:click={() => $createToken.mutate()}>
			<i class="ti ti-plus"></i>
			{$t('Create New Token', { ns: 'openapi' })}
		</Button>
	</div>
</div>
