<script lang="ts">
  import type { SessionData, ActiveSessions } from "@shared/types";
  import SessionItem from "./SessionItem.svelte";

  export let sessions: SessionData[];
  export let activeSessions: ActiveSessions;
  export let currentDomain: string;
  export let onSessionClick: (id: string) => void;
  export let onRename: (id: string) => void;
  export let onDelete: (id: string) => void;
  export let onReorder: (sessionIds: string[]) => void;

  let draggedOverIndex: number | null = null;

  $: domainSessions = sessions
    .filter((s) => s.domain === currentDomain)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  $: activeSessionId = activeSessions[currentDomain];

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    e.dataTransfer!.dropEffect = "move";
  }

  function handleDragEnter(e: DragEvent, index: number) {
    draggedOverIndex = index;
  }

  function handleDragLeave() {
    draggedOverIndex = null;
  }

  function handleDrop(e: DragEvent, dropIndex: number) {
    e.preventDefault();
    draggedOverIndex = null;

    const draggedId = e.dataTransfer!.getData("text/plain");
    const draggedIndex = domainSessions.findIndex((s) => s.id === draggedId);

    if (draggedIndex === -1 || draggedIndex === dropIndex) return;

    const reordered = [...domainSessions];
    const [removed] = reordered.splice(draggedIndex, 1);
    reordered.splice(dropIndex, 0, removed);

    const reorderedIds = reordered.map((s) => s.id);
    onReorder(reorderedIds);
  }
</script>

{#if domainSessions.length === 0}
  <div class="no-sessions">No sessions saved for this site</div>
{:else}
  <div class="sessions-list">
    {#each domainSessions as session, i (session.id)}
      <div
        on:dragover={handleDragOver}
        on:dragenter={(e) => handleDragEnter(e, i)}
        on:dragleave={handleDragLeave}
        on:drop={(e) => handleDrop(e, i)}
        class:drag-over={draggedOverIndex === i}
        role="none"
      >
        <SessionItem
          {session}
          isActive={session.id === activeSessionId}
          {onRename}
          {onDelete}
          onClick={onSessionClick}
        />
      </div>
    {/each}
  </div>
{/if}
