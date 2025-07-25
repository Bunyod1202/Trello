<template>
  <q-layout>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useUserStore } from 'src/stores/user'
import { Dark } from 'quasar'
const userStore = useUserStore()
Dark.set(userStore.getTheme)
</script>
