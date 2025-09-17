import { defineStore } from "pinia";

export const usePanelStore = defineStore("panel", {
  state: () => ({
    mode: localStorage.getItem("panelMode") || "user"
  }),
  actions: {
    setMode(newMode) {
      this.mode = newMode;
      localStorage.setItem("panelMode", newMode);
    }
  }
});
