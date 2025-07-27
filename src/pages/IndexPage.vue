<template>
  <q-page
    class="q-pa-md dashboard"
    style="background-image: url('/bg.webp'); background-size: 100%"
  >
    <q-layout view="hHh lpR fFf">
      <q-header reveal class="dashboard-header">
        <q-toolbar>
          <q-btn flat icon="menu" @click="leftDrawerOpen = !leftDrawerOpen" />
          <q-toolbar-title>
            <div v-if="!$q.screen.lt.sm">
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
              </q-avatar>
              {{ userStore.getUser.email }}
            </div>
          </q-toolbar-title>
          <q-toggle v-model="darkMode" icon="dark_mode" />
          <q-btn color="primary" icon="add" label="Добавить задачу" @click="showDialog" />
        </q-toolbar>
      </q-header>
      <q-drawer class="q-pa-md" show-if-above v-model="leftDrawerOpen" side="left" bordered>
        <q-btn class="float-right" flat icon="close" @click="leftDrawerOpen = !leftDrawerOpen" />

        <div v-if="!!$q.screen.lt.sm">
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
          {{ userStore.getUser.email }}
        </div>
        <q-btn flat icon="sort" @click="sortTasks" label="Сортировать по дате" />
      </q-drawer>
      <q-page-container>
        <TaskList :all-tasks="sortedTasks" />
        <q-dialog v-model="dialog">
          <q-card>
            <div class="text-center text-h6">Добавить задачу</div>
            <q-card-section>
              <q-input
                standout
                v-model="form.title"
                label="Название"
                lazy-rules
                :rules="[(val) => !!val || 'Обязательный']"
              />
              <q-input
                standout
                v-model="form.description"
                label="Описание"
                lazy-rules
                :rules="[(val) => !!val || 'Обязательный']"
              />
              <q-input
                standout
                v-model="form.dueDate"
                type="date"
                label="Дата завершения"
                lazy-rules
                :rules="[(val) => !!val || 'Обязательный']"
              />
              <q-select
                standout
                v-model="form.status"
                :options="['not_started', 'in_progress', 'done']"
                label="Статус"
                lazy-rules
                :rules="[(val) => !!val || 'Обязательный']"
              />
            </q-card-section>
            <q-card-section align="right">
              <q-btn flat label="Отмена" @click="resetForm" />
              <q-btn flat label="Сохранить" @click="submitTask" />
            </q-card-section>
          </q-card>
        </q-dialog>
      </q-page-container>
    </q-layout>
  </q-page>
</template>

<script setup>
import TaskList from 'src/components/tasks/TaskList.vue'
import { useTaskStore } from 'src/stores/tasks'
import { useQuasar } from 'quasar'
import { useUserStore } from 'src/stores/user'
import { useToolsStore } from 'src/stores/tools'
import { ref } from 'vue'
import { watch } from 'vue'
import { Dark } from 'quasar'
import { computed } from 'vue'

const $q = useQuasar()
const taskStore = useTaskStore()
const userStore = useUserStore()
const toolsStore = useToolsStore()
const dialog = computed(() => toolsStore.AddTaskDialog)
const sortedTasks = computed(() => {
  return [...taskStore.getTasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
})
const leftDrawerOpen = ref(false)
const sort = ref(false)
const darkMode = ref(userStore.getTheme)
const form = ref({
  title: '',
  description: '',
  dueDate: '',
  status: '',
})

const sortTasks = () => {
  sort.value = true
  taskStore.setGroupedTasks(taskStore.getTasks, sort.value)
}

const submitTask = () => {
  if (!form.value.title || !form.value.dueDate || !form.value.status) {
    $q.notify({ type: 'negative', message: 'Пожалуйста, заполните все обязательные поля.' })
    return
  }
  taskStore.setTasks({ ...form.value, id: Date.now() })
  toolsStore.toggleAddTaskDialog()
  form.value = { title: '', description: '', dueDate: '', status: '' }
}

const showDialog = () => {
  toolsStore.toggleAddTaskDialog()
}

const resetForm = () => {
  form.value = { title: '', description: '', dueDate: '', status: '' }
  toolsStore.toggleAddTaskDialog()
}

watch(
  () => darkMode.value,
  (val) => {
    Dark.set(val)
    userStore.setTheme(val)
  },
)
</script>

<style scoped>
.q-page {
  background-color: #f5f5f5;
  min-height: 100vh;
}
.dashboard {
  background-image: url('/bg.webp');
  background-size: 2000px;
  background-repeat: no-repeat;
  background-position: center;
}
.dashboard-header {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
