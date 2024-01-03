<script>
  import { onDestroy } from "svelte";
  import { navigate } from "svelte-navigator";
  import { isAuthenticated } from "../store/store.js";

  let userAuthenticated = $isAuthenticated;

  const unsubscribe = isAuthenticated.subscribe((value) => {
    userAuthenticated = value;
    if (!userAuthenticated) {
      navigate("/");
    }
  });

  onDestroy(() => {
    unsubscribe();
  });
</script>

{#if userAuthenticated}
  <slot />
{/if}
