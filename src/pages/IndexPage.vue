<template>
  <q-page class="q-pa-md">
    <q-layout view="hHh lpR fFf">
      <q-header reveal :class="$q.dark.isActive ? 'bg-secondary' : 'bg-black'">
        <q-toolbar>
          <q-toolbar-title>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
            {{ userStore.getUser.email }}
          </q-toolbar-title>
          <q-btn color="primary" icon="add" label="Add Task" />
        </q-toolbar>
      </q-header>

      <q-page-container>
        <TaskList :all-tasks="taskStore.getTasks" @on-drag-end="onDragEnd" />
      </q-page-container>
    </q-layout>
  </q-page>
</template>

<script setup>
import TaskList from 'src/components/tasks/TaskList.vue'
import { useTaskStore } from 'src/stores/tasks'
import { useQuasar } from 'quasar'
import { useUserStore } from 'src/stores/user'

const $q = useQuasar()
const taskStore = useTaskStore()
const userStore = useUserStore()
</script>

<style scoped>
.q-page {
  background-color: #f5f5f5;
  min-height: 100vh;
}
</style>
