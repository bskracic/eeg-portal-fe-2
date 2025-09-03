// Utilities
import { defineStore } from 'pinia'

interface AppState {
  theme: 'light' | 'dark'
  drawer: boolean
  navigation: boolean
  loading: boolean
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    theme: 'light',
    drawer: true,
    navigation: true,
    loading: false
  }),
  
  getters: {
    isDark: (state) => state.theme === 'dark',
    isLoading: (state) => state.loading
  },
  
  actions: {
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
    },
    toggleDrawer() {
      this.drawer = !this.drawer
    },
    setLoading(value: boolean) {
      this.loading = value
    }
  }
})
