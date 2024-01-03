<script>
	import { navigate } from "svelte-navigator";
	import { setAuthenticated } from "../store/store.js";
	import { userDetails } from "../store/userStore.js";
	import Icon from "@iconify/svelte";

	function goToUserDetails() {
		navigate("/user-details");
	}
	function handleLogout() {
		localStorage.removeItem("token");
		setAuthenticated(false);
		userDetails.set(null);
		navigate("/");
	}
</script>

<header class="header">
	<div class="header-content responsive-wrapper">
		<div class="header-logo">
			<a>
				<div>
					<img
						src="https://assets.codepen.io/285131/untitled-ui-icon.svg"
					/>
				</div>
			</a>
		</div>
		<div class="header-navigation">
			<nav class="header-navigation-links">
				<a href="/"> Home </a>
			</nav>
			<div class="header-navigation-actions">
				<a class="button">
					<i class="ph-lightning-bold"></i>
					<span on:click={handleLogout} on:keydown={handleLogout}>Log out</span>
				</a>
				<a href="#" class="icon-button">
					<i class="ph-gear-bold"></i>
				</a>
				<a href="#" class="icon-button">
					<i class="ph-bell-bold"></i>
				</a>
				<a
					class="icon-button"
					on:click|preventDefault={goToUserDetails} on:keydown={goToUserDetails}
				>
					<Icon class="icon" icon="mdi:account" />
				</a>
			</div>
		</div>
	</div>
</header>
