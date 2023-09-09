<script lang="ts">
	import { Button } from '$components/ui/button'
	import { t } from '$lib/i18n'
	import { trpc } from '$lib/trpc/client'

	const getApiTokens = trpc().openapi.apiToken.list.query(undefined, {
		enabled: false,
	})

	const createToken = trpc().openapi.apiToken.create.mutation({
		async onSuccess(data, variables, context) {
			await $getApiTokens.refetch()
		},
	})
</script>

<div class="w-full h-full flex flex-col items-center justify-center gap-6">
	<h3 class="text-xl font-bold">{$t('Empty Api Token', { ns: 'openapi' })}</h3>
	<Button class="w-56 gap-2" on:click={() => $createToken.mutate()}>
		<i class="ti ti-plus"></i>
		{$t('Create New Token', { ns: 'openapi' })}
	</Button>
</div>
