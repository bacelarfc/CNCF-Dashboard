<script>
    import { onMount } from 'svelte';
    import { cncfData, categories, selectedCategory, fetchData } from './store/contentStore.js';
    import MainContent from "./components/MainContent.svelte";
    import TrendChart from "./components/TrendChart.svelte";
    import ProjectModal from "./components/ProjectModal.svelte";
    import { isAuthenticated } from './store/store.js';
    import { navigate } from 'svelte-navigator';
    import Header from './components/Header.svelte';
    import FilterTag from './components/FilterTag.svelte';
    let showFilter = false;
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
        sortBy = '';
        showFilter = false;
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

    //filter
    let sortBy = ''; 

    function handleSortChange(event) {
        sortBy = event.target.value;
    }

    function selectFilter(filter) {
        sortBy = filter;
        showFilter = true;
    }

    function removeFilter() {
        sortBy = '';
        showFilter = false;
    }
</script>

    
    <Header />
    <main class="main">
        <div class="responsive-wrapper">
            <div class="main-header">
                <h1>Categories</h1>
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
            <!-- <div class="content-header">
                 <div class="content-header-actions">
                    <a href="#" class="button">
                        <i class="ph-faders-bold"></i>
                        <span>Filters</span>
                    </a> -->
                    <!-- <a href="#" class="button">
                        <i class="ph-plus-bold"></i>
                        <span>Request integration</span>
                    </a> -->
                <!-- </div> -->
            <!-- </div> -->
            <div class="content-header-actions">
                <!-- <select on:change={handleSortChange}>
                    <option value="">Select Filter</option>
                    <option value="starCount">Star Count</option>
                </select> -->
                <div class="filter-selection">
                    <button class="button" on:click={() => selectFilter('starCount')}>Sort by</button>
                    <!-- Add other filter buttons if needed -->
                    {#if showFilter}
                        <FilterTag label="Star Count" onRemove={removeFilter} />
                    {/if}
                </div>
            </div>
            <div class="content">
                {#if selectedProject}
                <ProjectModal searchResults={[selectedProject]} onClose={closeModal} />
            {:else if $selectedCategory}
                <MainContent sortBy={sortBy} />
            {:else}
                <TrendChart />
            {/if}
        </div>
    </div>
</main>
