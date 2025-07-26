<template>
  <div class="q-pa-md row wrap justify-around">
    <div
      v-for="(tasks, status) in groupedTasks"
      :key="status"
      class="column q-pa-sm col-12 col-md-4"
    >
      <q-card flat bordered class="bg-grey-1">
        <q-card-section class="text-white" :class="`bg-${collorLabels[status]}`">
          <div class="text-h6">{{ statusLabels[status] }}</div>
        </q-card-section>
        <q-card-section>
          <!-- {{ taskStore.getTasks }} -->
          <TaskItemCard :tasks="taskStore.getTasks" :status="status" @on-drag-end="onDragEnd" />
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTaskStore } from 'src/stores/tasks'
import TaskItemCard from './TaskItemCard.vue'

const taskStore = useTaskStore()

const groupedTasks = computed(() => {
  const groups = {
    not_started: [],
    in_progress: [],
    done: [],
  }
  taskStore.tasks.forEach((task) => {
    if (groups[task.status]) {
      groups[task.status].push(task)
    }
  })
  return groups
})

const collorLabels = {
  not_started: 'primary',
  in_progress: 'warning',
  done: 'positive',
}

const statusLabels = {
  not_started: '⏳ Не начато',
  in_progress: '🚧 В процессе',
  done: '✅ Завершено',
}
</script>

<style lang="scss" scoped></style>
