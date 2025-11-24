import { mount } from "svelte";
import "./style.css";
import Popup from "./Popup.svelte";

// Mount Svelte app when DOM is ready
const app = mount(Popup, {
  target: document.getElementById("app")!,
});

export default app;
