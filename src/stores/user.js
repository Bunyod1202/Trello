import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: JSON.parse(localStorage.getItem('token')) || '',
    theme: JSON.parse(localStorage.getItem('theme')) || false,
    user: JSON.parse(localStorage.getItem('user')) || {},
  }),
  getters: {
    getToken: (state) => state.token,
    getUser: (state) => state.user,
    getTheme: (state) => state.theme,
  },
  actions: {
    setToken(token) {
      this.token = token
      localStorage.setItem('token', JSON.stringify(token))
    },
    setUser(user) {
      this.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    setTheme(theme) {
      this.theme = theme
      localStorage.setItem('theme', JSON.stringify(theme))
    },
  },
})
