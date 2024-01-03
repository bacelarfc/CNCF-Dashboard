<script>
    import { onMount } from 'svelte';
    import { cncfData, categories, selectedCategory, fetchData } from './store/contentStore.js';
    import MainContent from "./components/MainContent.svelte";
    import TrendChart from "./components/TrendChart.svelte";
    import ProjectModal from "./components/ProjectModal.svelte";
    import { isAuthenticated } from './store/store.js';
    import { navigate } from 'svelte-navigator';
    import Header from './components/Header.svelte';
    
    let searchQuery = '';
    let searchResults = [];
    let showModal = false;
    let selectedProject = null;

    onMount(() => {
        isAuthenticated.subscribe(value => {
            if (!value) {
                navigate('/');
            } else {
                fetchData(); 
            }
        });
    });


    function handleCategoryClick(category) {
        selectedCategory.set(category);
    }

    function selectProject(project) {
        selectedProject = project;
    }

  $: if (searchQuery) {
        searchResults = $cncfData.filter(project =>
            project.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    } else {
        searchResults = [];
    }

    function closeModal() {
        showModal = false;
        searchQuery = ''; 
    }

    $: showModal = searchResults.length > 0 && searchQuery.length > 0;
    $: showTrendChart = $selectedCategory === null || $selectedCategory === undefined;
</script>

    
    <Header />
    <main class="main">
        <div class="responsive-wrapper">
            <div class="main-header">
                <h1>Groups</h1>
                        <div class="search">
                            <input type="text" placeholder="Search" bind:value={searchQuery} />
                                <i class="ph-magnifying-glass-bold"></i>
                        </div>
                    
                        {#if showModal}
            <ProjectModal {searchResults} onClose={closeModal} />
        {/if}
            </div>
            <div class="horizontal-tabs">
                {#each $categories as category}
                    <a href="/" on:click|preventDefault={()  => handleCategoryClick(category)}>{category}</a>
                {/each}
            </div>
            <div class="content-header">
                <div class="content-header-intro">
                    <h2>Intergrations and connected apps</h2>
                    <p>Supercharge your workflow and connect the tool you use every day.</p>
                </div>
                <!-- <div class="content-header-actions">
                    <a href="#" class="button">
                        <i class="ph-faders-bold"></i>
                        <span>Filters</span>
                    </a> -->
                    <!-- <a href="#" class="button">
                        <i class="ph-plus-bold"></i>
                        <span>Request integration</span>
                    </a> -->
                <!-- </div> -->
            </div>
            <div class="content">
                {#if selectedProject}
                <ProjectModal searchResults={[selectedProject]} onClose={closeModal} />
            {:else if $selectedCategory}
                <MainContent />
            {:else}
                <TrendChart />
            {/if}
        </div>
    </div>
</main>
