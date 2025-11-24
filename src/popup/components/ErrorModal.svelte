<script lang="ts">
  import Modal from "./Modal.svelte";

  export let show: boolean = false;
  export let message: string = "";
  export let onClose: () => void;
</script>

<Modal {show} {onClose}>
  <div class="modal-header">
    <h3>Error</h3>
    <button class="close-btn" on:click={onClose}>&times;</button>
  </div>
  <div class="modal-body">
    <p>{message}</p>
  </div>
  <div class="modal-footer">
    <button class="btn btn-primary" on:click={onClose}>Close</button>
  </div>
</Modal>
