<script lang="ts">
  import Modal from "./Modal.svelte";

  export let show: boolean = false;
  export let onConfirm: (name: string) => void;
  export let onCancel: () => void;

  let sessionName = "Unnamed Session";
  let inputElement: HTMLInputElement;

  $: if (show && inputElement) {
    setTimeout(() => {
      inputElement.focus();
      inputElement.select();
    }, 0);
  }

  function handleConfirm() {
    onConfirm(sessionName.trim());
    sessionName = "Unnamed Session";
  }

  function handleCancel() {
    onCancel();
    sessionName = "Unnamed Session";
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
    <h3>Save Session</h3>
    <button class="close-btn" on:click={handleCancel}>&times;</button>
  </div>
  <div class="modal-body">
    <label for="sessionName">Session Name:</label>
    <input
      type="text"
      id="sessionName"
      bind:this={inputElement}
      bind:value={sessionName}
      on:keydown={handleKeydown}
      placeholder="Enter session name"
    />
  </div>
  <div class="modal-footer">
    <button class="btn btn-secondary" on:click={handleCancel}>Cancel</button>
    <button class="btn btn-primary" on:click={handleConfirm}>Save</button>
  </div>
</Modal>
