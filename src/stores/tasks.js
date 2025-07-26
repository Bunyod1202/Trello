import { defineStore } from 'pinia'

export const useTaskStore = defineStore('taskStore', {
  state: () => ({
    groupedTasks: {},
    tasks: [
      {
        id: 1,
        title: 'Frontend task',
        description: 'Vue 3 componentlar',
        dueDate: '2025-07-27',
        status: 'not_started',
      },
      {
        id: 2,
        title: 'Backend task',
        description: 'API yaratish',
        dueDate: '2025-07-30',
        status: 'in_progress',
      },
    ],
  }),
  getters: {
    getGroupedTasks: (state) => state.groupedTasks,
    getTasks: (state) => state.tasks,
  },
  actions: {
    setTasks(newTasks) {
      this.tasks = newTasks
    },
    setChangeTaskStatus(newTasks) {
      const all = [
        ...newTasks.not_started.map((task) => ({ ...task, status: 'not_started' })),
        ...newTasks.in_progress.map((task) => ({ ...task, status: 'in_progress' })),
        ...newTasks.done.map((task) => ({ ...task, status: 'done' })),
      ]
      this.tasks = all
      this.setGroupedTasks(all)
    },
    setGroupedTasks(newTasks) {
      const groups = {
        not_started: [],
        in_progress: [],
        done: [],
      }
      newTasks.forEach((task) => {
        if (groups[task.status]) {
          groups[task.status].push(task)
        }
      })
      this.groupedTasks = groups
    },
  },
})
