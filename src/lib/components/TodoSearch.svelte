<script lang="ts">
  import { searchQuery, searchOptions } from '$lib/stores/todos';
  import { Search, X, Settings } from 'lucide-svelte';
  import { debounce } from '$lib/utils';

  let showAdvanced = false;
  let inputValue = '';

  $: options = $searchOptions;

  // Debounced search
  const debouncedSearch = debounce((value: string) => {
    searchQuery.set(value);
  }, 300);

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    inputValue = target.value;
    debouncedSearch(inputValue);
  }

  function clearSearch() {
    inputValue = '';
    searchQuery.set('');
  }

  function updateOption(key: keyof typeof options, value: boolean) {
    searchOptions.update(opts => ({ ...opts, [key]: value }));
  }
</script>

<div class="search-container">
  <div class="search-input-container">
    <div class="search-icon">
      <Search size={18} />
    </div>
    
    <input
      type="text"
      placeholder="Поиск задач..."
      class="search-input"
      bind:value={inputValue}
      on:input={handleInput}
    />
    
    {#if inputValue}
      <button class="clear-btn" on:click={clearSearch}>
        <X size={16} />
      </button>
    {/if}
    
    <button 
      class="settings-btn"
      class:active={showAdvanced}
      on:click={() => showAdvanced = !showAdvanced}
    >
      <Settings size={16} />
    </button>
  </div>

  {#if showAdvanced}
    <div class="advanced-options">
      <label class="option">
        <input
          type="checkbox"
          checked={options.caseSensitive}
          on:change={(e) => updateOption('caseSensitive', e.target.checked)}
        />
        <span>Учитывать регистр</span>
      </label>
      
      <label class="option">
        <input
          type="checkbox"
          checked={options.exactMatch}
          on:change={(e) => updateOption('exactMatch', e.target.checked)}
        />
        <span>Точное совпадение</span>
      </label>
    </div>
  {/if}
</div>

<style>
  .search-container {
    margin-bottom: 1.5rem;
  }

  .search-input-container {
    position: relative;
    display: flex;
    align-items: center;
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    transition: border-color 0.2s;
  }

  .search-input-container:focus-within {
    border-color: #3b82f6;
  }

  .search-icon {
    position: absolute;
    left: 1rem;
    color: #9ca3af;
    pointer-events: none;
  }

  .search-input {
    flex: 1;
    padding: 0.75rem 1rem 0.75rem 2.75rem;
    border: none;
    background: transparent;
    font-size: 1rem;
    outline: none;
  }

  .clear-btn, .settings-btn {
    position: absolute;
    right: 0.5rem;
    padding: 0.25rem;
    background: none;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    color: #6b7280;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .clear-btn {
    right: 2.5rem;
  }

  .clear-btn:hover, .settings-btn:hover {
    background: #f3f4f6;
    color: #374151;
  }

  .settings-btn.active {
    background: #3b82f6;
    color: white;
  }

  .advanced-options {
    margin-top: 0.75rem;
    padding: 1rem;
    background: #f9fafb;
    border-radius: 0.5rem;
    display: flex;
    gap: 1.5rem;
  }

  .option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.875rem;
    color: #6b7280;
  }

  .option input[type="checkbox"] {
    width: 1rem;
    height: 1rem;
    accent-color: #3b82f6;
  }

  @media (max-width: 640px) {
    .advanced-options {
      flex-direction: column;
      gap: 0.75rem;
    }
  }
</style>