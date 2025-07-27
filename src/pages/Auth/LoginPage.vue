<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md login-card" style="max-width: 600px">
      <q-form @submit="Authorization" @reset="onReset" class="q-gutter-md">
        <q-input
          standout
          v-model="user.email"
          type="email"
          prefix="Email:"
          lazy-rules
          :rules="[(val) => isValidEmail(val) || 'Please enter correct email']"
        >
          <template v-slot:prepend>
            <q-icon name="mail" />
          </template>
        </q-input>
        <q-input
          v-model="user.password"
          label="Пароль"
          filled
          :type="isPwd ? 'password' : 'text'"
          lazy-rules
          :rules="[(val) => val.length > 6 || 'Пароль должен содержать более 6 символов']"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <q-toggle icon="dark_mode" v-model="darkMode" label="Сменить тему" />

        <div class="flex justify-end">
          <q-btn label="Сбросить" type="reset" color="primary" flat class="q-ml-sm" />
          <q-btn label="Войти" type="submit" color="primary" />
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Dark, useQuasar } from 'quasar'
import { useUserStore } from 'src/stores/user'
import { useRouter } from 'vue-router'

const router = useRouter()
const $q = useQuasar()
const userStore = useUserStore()
const user = ref({
  email: '',
  password: '',
})
const isPwd = ref(true)
const darkMode = ref(userStore.getTheme)

function isValidEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return email.match(pattern) !== null
}

function Authorization() {
  if (isValidEmail(user.value.email) && user.value.password.length > 6) {
    userStore.setToken('123')
    userStore.setUser(user.value)
    userStore.setTheme(darkMode.value)
    $q.notify({
      type: 'positive',
      message: 'Авторизация успешна',
    })
    router.push('/')
  } else {
    $q.notify({
      type: 'negative',
      message: 'Authorization error',
    })
  }
}

function onReset() {
  user.value = {
    email: '',
    password: '',
  }
}

watch(
  () => darkMode.value,
  (val) => {
    Dark.set(val)
    userStore.setTheme(val)
  },
)
</script>

<style lang="scss" scoped>
.login-page {
  background-color: #f5f5f5;
}
</style>
