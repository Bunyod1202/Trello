import { defineStore } from 'pinia'

export const useToolsStore = defineStore('tools', {
  state: () => ({
    AddTaskDialog: false,
    editTaskDialog: false,
  }),
  actions: {
    toggleAddTaskDialog() {
      this.AddTaskDialog = !this.AddTaskDialog
    },
    toggleEditTaskDialog() {
      this.editTaskDialog = !this.editTaskDialog
    },
  },
})
