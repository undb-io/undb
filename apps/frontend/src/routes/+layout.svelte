<script lang="ts">
	import '../app.postcss'
	import NProgress from 'nprogress'
	import { navigating, page } from '$app/stores'
	import { QueryClientProvider } from '@tanstack/svelte-query'
	import { trpc } from '$lib/trpc/client'
	import { env } from '$env/dynamic/public'
	import { Toaster } from 'svelte-sonner'

	import 'nprogress/nprogress.css'
	import { onMount } from 'svelte'
	import { changeThemeMode } from '$lib/store/ui'
	import { LIGHT_THEME, type Theme } from '$lib/store/ui.type'
	import { me, role } from '$lib/store/me'

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

	$: if ($page.data.me?.me) {
		me.set($page.data.me?.me)
	}
	$: if ($page.data.me?.member?.role) {
		role.set($page.data.me?.member?.role)
	}

	onMount(async () => {
		if (env.PUBLIC_UNDB_ANALYTICS_DOMAIN) {
			const Plausible = await import('plausible-tracker').then((m) => m.default)
			Plausible({
				domain: env.PUBLIC_UNDB_ANALYTICS_DOMAIN,
			})
		}
		const theme = window.localStorage.getItem('theme') ?? LIGHT_THEME

		changeThemeMode(theme as Theme)
	})
</script>

<QueryClientProvider client={trpc().queryClient}>
	<slot />
</QueryClientProvider>

<svelte:head>
	<title>undb</title>
</svelte:head>

<svelte:window on:beforeunload={null} />

<Toaster richColors position="bottom-center" />
