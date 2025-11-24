<script lang="ts">
  import Modal from "./Modal.svelte";

  export let show: boolean = false;
  export let sessionName: string = "";
  export let onConfirm: () => void;
  export let onCancel: () => void;

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      onConfirm();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<Modal {show} onClose={onCancel}>
  <div class="modal-header">
    <h3>Delete Session</h3>
    <button class="close-btn" on:click={onCancel}>&times;</button>
  </div>
  <div class="modal-body">
    <p>Are you sure you want to delete the session "<strong>{sessionName}</strong>"?</p>
    <p class="warning-text">This action cannot be undone.</p>
  </div>
  <div class="modal-footer">
    <button class="btn btn-secondary" on:click={onCancel}>Cancel</button>
    <button class="btn btn-danger" on:click={onConfirm}>Delete</button>
  </div>
</Modal>
