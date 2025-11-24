<script lang="ts">
  export let show: boolean = false;
  export let onClose: () => void;

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      onClose();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <div 
    class="modal show" 
    on:click={handleBackdropClick} 
    role="dialog" 
    aria-modal="true"
    tabindex="-1"
  >
    <div class="modal-content">
      <slot />
    </div>
  </div>
{/if}
