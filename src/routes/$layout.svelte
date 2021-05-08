<script context="module" lang="ts">
	import { auth as ae, initialized as fbwasinit } from "$lib/firebase";
	import { browser } from "$app/env";
	export async function load({ page, fetch, session, context }) {
		if (!browser) return {};
		await fbwasinit;
		return {};
	}
</script>

<script lang="ts">
	import "../app.css";
	import { user, auth } from "$lib/firebase";
	$: if ($user === null)
		window["google"].accounts.id.prompt((notification: any) => {
			if (
				notification.isDismissedMoment() &&
				notification.getDismissedReason() === "credential_returned" &&
				$user === null
			) {
				$user = undefined;
				// If the user has not yet been logged in (timing race with callback),
				// making $user undefined should show "Loading account..." in $layout.
			}
		});
</script>

<svelte:head
	><link
		href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap"
		rel="stylesheet"
	/>
	<script src="https://accounts.google.com/gsi/client" defer></script>
</svelte:head>
<header><span class="latin">fac simile</span> - Latin, "to make a copy"</header>

<main>
	<slot />
</main>

<footer>
	<!-- You are {$user?.displayName ?? "logged out"}. -->
	{#if !browser}
		Loading JavaScript...
	{:else if $user === undefined}
		Loading account...
	{:else if $user === null}
		You are logged out.
	{:else}
		You are {$user.displayName}.
		<a href={"#"} on:click={async () => await auth.signOut()}>Log out.</a>
	{/if}
</footer>

<style>
	:global(body) {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	header {
		font-size: 1.5rem;
	}

	header span.latin {
		font-size: 2rem;
		font-family: "Pacifico", serif;
	}

	main {
		flex: 1;
	}

	footer {
		font-size: 1.2rem;
		text-align: right;
	}

	footer a {
		color: inherit;
	}
</style>
