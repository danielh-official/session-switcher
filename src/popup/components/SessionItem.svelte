<script lang="ts">
  import type { SessionData } from "@shared/types";
  import { formatDate } from "@shared/utils/date";

  export let session: SessionData;
  export let isActive: boolean = false;
  export let onRename: (id: string) => void;
  export let onDelete: (id: string) => void;
  export let onClick: (id: string) => void;

  let isDragging = false;

  function handleDragStart(e: DragEvent) {
    isDragging = true;
    e.dataTransfer!.effectAllowed = "move";
    e.dataTransfer!.setData("text/plain", session.id);
  }

  function handleDragEnd() {
    isDragging = false;
  }

  function handleRenameClick(e: Event) {
    e.stopPropagation();
    onRename(session.id);
  }

  function handleDeleteClick(e: Event) {
    e.stopPropagation();
    onDelete(session.id);
  }

  function handleClick() {
    onClick(session.id);
  }
</script>

<div
  class="session-item {isActive ? 'active' : ''} {isDragging ? 'dragging' : ''}"
  draggable="true"
  on:dragstart={handleDragStart}
  on:dragend={handleDragEnd}
  on:click={handleClick}
  on:keypress={(e) => e.key === 'Enter' && handleClick()}
  role="button"
  tabindex="0"
>
  <div class="drag-handle">⋮⋮</div>
  <div class="session-info">
    <div class="session-name">{session.name}</div>
    <div class="session-meta">Last used {formatDate(session.lastUsed)}</div>
  </div>
  <div class="session-actions">
    <button
      class="session-btn rename-btn"
      on:click={handleRenameClick}
      aria-label="Rename session"
    >
      ✏️
    </button>
    <button
      class="session-btn delete-btn"
      on:click={handleDeleteClick}
      aria-label="Delete session"
    >
      🗑️
    </button>
  </div>
</div>
