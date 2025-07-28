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
        <q-btn class="q-mt-md" flat icon="sort" @click="sortTasks" label="Сортировать по дате" />
        <q-select
          standout
          v-model="taskStatus"
          :options="statusOptionsFilter"
          label="Фильтр по статусу"
        />
        <q-list bordered separator class="q-mt-md">
          <q-item v-for="item in taskStatusFilter" :key="item.id" clickable>
            <q-card class="card-section-bg q-mb-sm cursor-pointer p-3" style="width: 100%" bordered>
              <q-card-section>
                <div>{{ item.title }}</div>
                <p class="text-caption wrap">
                  {{ item.description }}
                </p>
                <div class="row justify-between">
                  <div class="text-caption text-grey">📅 {{ item.dueDate }}</div>
                  <div
                    class="text-white q-pa-xs"
                    :class="
                      item.status === 'not_started'
                        ? 'bg-indigo-6'
                        : item.status === 'in_progress'
                          ? 'bg-yellow-6'
                          : 'bg-green-6'
                    "
                  ></div>
                </div>
              </q-card-section>
            </q-card>
          </q-item>
        </q-list>
      </q-drawer>
      <q-page-container>
        <TaskList />
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
                type="textarea"
                lazy-rules
                :rules="[(val) => !!val || 'Обязательный']"
              />
              <q-input
                standout
                label="Дата завершения"
                v-model="form.dueDate"
                mask="date"
                lazy-rules
                :rules="['date']"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="form.dueDate" mask="YYYY/MM/DD" :options="optionFn">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-select
                standout
                v-model="form.status"
                :options="statusOptions"
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
const leftDrawerOpen = ref(false)
const taskStatus = ref({
  label: 'Все',
  value: 'all',
})
const statusOptions = [
  {
    label: 'Не начато',
    value: 'not_started',
  },
  {
    label: 'В процессе',
    value: 'in_progress',
  },
  {
    label: 'Завершено',
    value: 'done',
  },
]
const statusOptionsFilter = [
  {
    label: 'Не начато',
    value: 'not_started',
  },
  {
    label: 'В процессе',
    value: 'in_progress',
  },
  {
    label: 'Завершено',
    value: 'done',
  },
  {
    label: 'Все',
    value: 'all',
  },
]
const sort = ref(false)
const darkMode = ref(userStore.getTheme)
const form = ref({
  title: '',
  description: '',
  dueDate: '',
  status: '',
})
const items = computed(() => taskStore.getTasks)

// const filteredItems = computed(() => {
//   if (!searchQuery.value) return items.value

//   return items.value.filter((item) =>
//     item.title.toLowerCase().includes(searchQuery.value.toLowerCase()),
//   )
// })
const taskStatusFilter = computed(() => {
  if (taskStatus.value.value === 'all') return items.value

  return items.value.filter((item) => item.status === taskStatus.value.value)
})

function formatDateToYMD(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}/${month}/${day}`
}
function optionFn(dateStr) {
  return dateStr >= formatDateToYMD(new Date())
}
const sortTasks = () => {
  sort.value = true
  taskStore.tasks = taskStore.tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
  taskStore.setGroupedTasks(taskStore.getTasks, sort.value)
}

const submitTask = () => {
  if (!form.value.title || !form.value.dueDate || !form.value.status) {
    $q.notify({ type: 'negative', message: 'Пожалуйста, заполните все обязательные поля.' })
    return
  }
  form.value.status = form.value.status.value
  taskStore.setTasks({ ...form.value, id: Date.now() })
  $q.notify({ type: 'positive', message: '✅ Задача добавлена!' })
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
