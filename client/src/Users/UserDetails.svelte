<script>
  import "../styles/userDetails.scss";
  import { onMount } from "svelte";
  import { userDetails, fetchUserDetails } from "../store/userStore.js";
  import { cncfData, fetchData } from "../store/contentStore.js";
  import Header from "../components/Header.svelte";
  let favoriteProjects = [];
  import { removeFavorite as removeFavoriteFromStore } from "../store/favoritesStore.js";

  async function removeFavorite(projectId) {
    await removeFavoriteFromStore(projectId);
    favoriteProjects = favoriteProjects.filter(
      (project) => project.id !== projectId,
    );
  }

  onMount(async () => {
    await Promise.all([fetchUserDetails(), fetchData()]);
  });

  $: if ($userDetails && $userDetails.favorites && $cncfData) {
    favoriteProjects = $cncfData.filter((project) =>
      $userDetails.favorites.includes(project.id),
    );
  }
</script>

<Header />
{#if $userDetails}
  <div class="user-info">
    <h2>{$userDetails.firstName}</h2>
    <p>{$userDetails.email}</p>
  </div>
  <div class="user-favorites">
    <h3>Favorite Projects</h3>
    {#each favoriteProjects as project}
      <div class="favorite-project card">
        <div class="card-header">
          <h4>{project.name}</h4>
        </div>
        <div class="card-body">
          <p>{project.description}</p>
          <a class="button">
            <span on:click={() => removeFavorite(project.id)} on:keydown={() => removeFavorite(project.id)}>Remove</span>
          </a>
        </div>
      </div>
    {/each}
  </div>
{:else}
  <p>User details not found.</p>
{/if}
