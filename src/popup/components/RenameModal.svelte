<script lang="ts">
  import Modal from "./Modal.svelte";

  export let show: boolean = false;
  export let currentName: string = "";
  export let onConfirm: (name: string) => void;
  export let onCancel: () => void;

  let newName = "";
  let inputElement: HTMLInputElement;

  $: if (show) {
    newName = currentName;
    if (inputElement) {
      setTimeout(() => {
        inputElement.focus();
        inputElement.select();
      }, 0);
    }
  }

  function handleConfirm() {
    onConfirm(newName.trim());
    newName = "";
  }

  function handleCancel() {
    onCancel();
    newName = "";
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleConfirm();
    }
  }
</script>

<Modal {show} onClose={handleCancel}>
  <div class="modal-header">
    <h3>Rename Session</h3>
    <button class="close-btn" on:click={handleCancel}>&times;</button>
  </div>
  <div class="modal-body">
    <label for="newSessionName">New Name:</label>
    <input
      type="text"
      id="newSessionName"
      bind:this={inputElement}
      bind:value={newName}
      on:keydown={handleKeydown}
      placeholder="Enter new name"
    />
  </div>
  <div class="modal-footer">
    <button class="btn btn-secondary" on:click={handleCancel}>Cancel</button>
    <button class="btn btn-primary" on:click={handleConfirm}>Rename</button>
  </div>
</Modal>
