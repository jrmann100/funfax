<script lang="ts">
	import "../app.css";
	import type { Writable } from "svelte/store";
	import { initializeApp, getApps } from "firebase/app";
	import { writable } from "svelte/store";
	import type { User, Auth } from "firebase/auth";
	import {
		GoogleAuthProvider,
		getAuth,
		signInWithCredential,
	} from "firebase/auth";
	import { onMount } from "svelte";
	import { dev, browser } from "$app/env";

	export let auth: Auth = undefined;
	export let user: Writable<User> = writable(undefined);
	onMount(() => {
		if (!browser) return;
		if (dev && getApps().length !== 0) return; // if hot reloading script, don't need to init again
		const app = initializeApp({
			apiKey: "AIzaSyBiJ0Ekx64Jfw2B0bliuKoASVWFXX5kB4A",
			authDomain: "funfax-net.firebaseapp.com",
			projectId: "funfax-net",
			storageBucket: "funfax-net.appspot.com",
			messagingSenderId: "194106239592",
			appId: "1:194106239592:web:65f06b451a2f63ab47a9dd",
		});

		auth = getAuth();
		auth.onAuthStateChanged(user.set);

		window["google"].accounts.id.initialize({
			client_id:
				"194106239592-jlrrhgjv90451tiitr0jn775iea8g11d.apps.googleusercontent.com",
			callback: async (c: any) =>
				await signInWithCredential(
					auth,
					GoogleAuthProvider.credential(c.credential)
				),
		});
	});

	$: if ($user === null)
		window["google"].accounts.id.prompt((notification) => {
			if (
				notification.isDismissedMoment() &&
				notification.getDismissedReason() === "credential_returned" &&
				$user === null
			) {
				$user = undefined;
				// If the user has not yet been logged in (timing race with callback),
				// making $user undefined will show the user "Loading account..."
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
	{#if $user === undefined}
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
