<script>
	import '../app.postcss'
	import NProgress from 'nprogress'
	import { navigating } from '$app/stores'

	import 'nprogress/nprogress.css'
	import { onMount } from 'svelte'
	import { browser } from '$app/environment'

	NProgress.configure({
		minimum: 0.16,
	})

	$: {
		if ($navigating) {
			NProgress.start()
		}
		if (!$navigating) {
			NProgress.done()
		}
	}

	onMount(() => {
		if (browser) {
			window.onbeforeunload = null
		}
	})
</script>

<slot />

<svelte:head>
	<title>undb</title>
</svelte:head>

<style>
	:global(#nprogress) {
		position: relative;
		z-index: 9999999;
	}
</style>
