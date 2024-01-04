<script>
    import "../styles/filter.scss";
    export let label;
    export let onRemove;
</script>

<div class="filter-tag">
    {label} <button on:click={onRemove}>X</button>
</div>


