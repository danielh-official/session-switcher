<script lang="ts">
  import { onMount } from "svelte";
  import { getDomainFromUrl } from "@shared/utils/domain";
  import { handleError } from "@shared/utils/errorHandling";
  import { PopupService } from "./services/popup.service";
  import type { SessionData, ActiveSessions } from "@shared/types";
  import SessionListComponent from "./components/SessionListComponent.svelte";
  import SaveModal from "./components/SaveModal.svelte";
  import RenameModal from "./components/RenameModal.svelte";
  import DeleteModal from "./components/DeleteModal.svelte";
  import ErrorModal from "./components/ErrorModal.svelte";

  let popupService: PopupService = null!;

  let isLoading = false;
  let currentDomain = "Loading...";
  let sessions: SessionData[] = [];
  let activeSessions: ActiveSessions = {};

  // Modal states
  let showSaveModal = false;
  let showRenameModal = false;
  let showDeleteModal = false;
  let showErrorModal = false;

  // Modal data
  let renameSessionId = "";
  let renameSessionName = "";
  let deleteSessionId = "";
  let deleteSessionName = "";
  let errorMessage = "";

  async function initialize() {
    try {
      isLoading = true;
      const state = await popupService.initialize();
      currentDomain = state.currentDomain;
      sessions = state.sessions;
      activeSessions = state.activeSessions;
    } catch (error) {
      showError(handleError(error, "initialize"));
    } finally {
      isLoading = false;
    }
  }

  async function handleSaveClick() {
    showSaveModal = true;
  }

  async function handleConfirmSave(name: string) {
    try {
      isLoading = true;
      await popupService.saveCurrentSession(name);
      const state = popupService.getState();
      sessions = state.sessions;
      activeSessions = state.activeSessions;
      showSaveModal = false;
    } catch (error) {
      showError(handleError(error, "save session"));
    } finally {
      isLoading = false;
    }
  }

  async function handleNewSessionClick() {
    try {
      isLoading = true;
      await popupService.createNewSession();
      const state = popupService.getState();
      sessions = state.sessions;
      activeSessions = state.activeSessions;
    } catch (error) {
      showError(handleError(error, "create new session"));
    } finally {
      isLoading = false;
    }
  }

  async function handleSessionSwitch(sessionId: string) {
    try {
      isLoading = true;
      await popupService.switchToSession(sessionId);
      const state = popupService.getState();
      sessions = state.sessions;
      activeSessions = state.activeSessions;
    } catch (error) {
      showError(handleError(error, "switch session"));
    } finally {
      isLoading = false;
    }
  }

  function handleRenameClick(sessionId: string) {
    const session = popupService.getSession(sessionId);
    if (session) {
      renameSessionId = sessionId;
      renameSessionName = session.name;
      showRenameModal = true;
    }
  }

  async function handleConfirmRename(newName: string) {
    try {
      if (newName && renameSessionId) {
        await popupService.renameSession(renameSessionId, newName);
        const state = popupService.getState();
        sessions = state.sessions;
      }
      showRenameModal = false;
      renameSessionId = "";
      renameSessionName = "";
    } catch (error) {
      showError(handleError(error, "rename session"));
    }
  }

  function handleDeleteClick(sessionId: string) {
    const session = popupService.getSession(sessionId);
    if (session) {
      deleteSessionId = sessionId;
      deleteSessionName = session.name;
      showDeleteModal = true;
    }
  }

  async function handleConfirmDelete() {
    try {
      if (deleteSessionId) {
        await popupService.deleteSession(deleteSessionId);
        const state = popupService.getState();
        sessions = state.sessions;
        activeSessions = state.activeSessions;
      }
      showDeleteModal = false;
      deleteSessionId = "";
      deleteSessionName = "";
    } catch (error) {
      showError(handleError(error, "delete session"));
    }
  }

  async function handleReorder(sessionIds: string[]) {
    try {
      await popupService.reorderSessions(sessionIds);
      const state = popupService.getState();
      sessions = state.sessions;
    } catch (error) {
      showError(handleError(error, "reorder sessions"));
    }
  }

  function showError(message: string) {
    console.error("Popup error:", message);
    errorMessage = message;
    showErrorModal = true;
  }

  // MARK: On Mount

  onMount(() => {
    console.log("Session Switcher popup loaded");

    // Initialize PopupService within component context
    popupService = new PopupService();

    initialize();

    // Tab change listeners
    const tabActivatedListener = async (activeInfo: { tabId: number }) => {
      const tab = await chrome.tabs.get(activeInfo.tabId);
      if (tab.url) {
        const newDomain = getDomainFromUrl(tab.url);
        if (newDomain !== currentDomain) {
          await initialize();
        }
      }
    };

    const tabUpdatedListener = async (_: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
      if (changeInfo.status === "complete" && tab.url) {
        const newDomain = getDomainFromUrl(tab.url);
        if (newDomain !== currentDomain) {
          await initialize();
        }
      }
    };

    chrome.tabs.onActivated.addListener(tabActivatedListener);
    chrome.tabs.onUpdated.addListener(tabUpdatedListener);

    return () => {
      chrome.tabs.onActivated.removeListener(tabActivatedListener);
      chrome.tabs.onUpdated.removeListener(tabUpdatedListener);
    };
  });
</script>

<!-- MARK: HTML -->

<div class="container" class:loading={isLoading}>
  <header class="header">
    <h1 class="title">
      Session Switcher
      <a class="byline" href="https://github.com/fanesz/session-switcher">by Fanesz</a>
    </h1>
    <span class="info-icon">
      i
      <div class="info-tooltip">
        <div class="tooltip-title">How to use Session Switcher:</div>
        <p><strong>1.</strong> Login to your first account</p>
        <p><strong>2.</strong> Press "Save Current Session"</p>
        <p><strong>3.</strong> Press "New Session"</p>
        <p><strong>4.</strong> Login to your other account</p>
        <p><strong>5.</strong> Press "Save Current Session"</p>
        <p><strong>6.</strong> Now you can easily switch between saved sessions!</p>
      </div>
    </span>
    <div class="current-site">{currentDomain}</div>
  </header>

  <main class="content">
    <div class="actions-top">
      <button class="btn btn-primary" on:click={handleSaveClick}>
        <span class="btn-icon">💾</span>
        Save Current Session
      </button>
      <button class="btn btn-secondary" on:click={handleNewSessionClick}>
        <span class="btn-icon">🆕</span>
        New Session
      </button>
    </div>

    <div class="sessions-section">
      <h3 class="section-title">Saved Sessions</h3>
      <SessionListComponent
        {sessions}
        {activeSessions}
        {currentDomain}
        onSessionClick={handleSessionSwitch}
        onRename={handleRenameClick}
        onDelete={handleDeleteClick}
        onReorder={handleReorder}
      />
    </div>
  </main>
</div>

<!-- MARK: - Modals -->
<SaveModal show={showSaveModal} onConfirm={handleConfirmSave} onCancel={() => (showSaveModal = false)} />

<RenameModal
  show={showRenameModal}
  currentName={renameSessionName}
  onConfirm={handleConfirmRename}
  onCancel={() => (showRenameModal = false)}
/>

<DeleteModal
  show={showDeleteModal}
  sessionName={deleteSessionName}
  onConfirm={handleConfirmDelete}
  onCancel={() => (showDeleteModal = false)}
/>

<ErrorModal show={showErrorModal} message={errorMessage} onClose={() => (showErrorModal = false)} />

<style>
  :global(body.loading) {
    cursor: wait;
    pointer-events: none;
  }
</style>
