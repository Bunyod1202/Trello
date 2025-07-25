import { useUserStore } from 'src/stores/user'

export default function auth(to, from, next) {
  const userStore = useUserStore()

  userStore.token ? next() : next({ name: 'login' })
}
