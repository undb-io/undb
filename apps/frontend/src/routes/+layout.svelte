<script>
	import '../app.postcss'
	import '@tabler/icons-webfont/tabler-icons.min.css'
	import NProgress from 'nprogress'
	import { navigating, page } from '$app/stores'
	import { QueryClientProvider } from '@tanstack/svelte-query'
	import { trpc } from '$lib/trpc/client'

	import 'nprogress/nprogress.css'

	NProgress.configure({
		minimum: 0.16,
	})

	$: {
		const r = $page.url.searchParams.get('r')
		// TODO: 判断前后是否一致
		if (!r) {
			if ($navigating && $navigating.from?.route.id !== $navigating.to?.route.id) {
				NProgress.start()
			}
		}
		if (!$navigating) {
			NProgress.done()
		}
	}
</script>

<QueryClientProvider client={trpc().queryClient}>
	<slot />
</QueryClientProvider>

<svelte:head>
	<title>undb</title>
	{#if import.meta.env.PUBLIC_UNDB_ANALYTICS}
		{import.meta.env.PUBLIC_UNDB_ANALYTICS}
	{/if}
</svelte:head>

<svelte:window on:beforeunload={null} />
