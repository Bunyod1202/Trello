<template>
  <div class="row wrap justify-around q-pa-md" v-if="groupedTasks">
    <div
      v-for="(_, status) in groupedTasks"
      :key="status"
      class="column col-12 q-pa-sm col-sm-4 col-md-4"
    >
      <q-card flat bordered>
        <q-card-section
          class="text-white"
          :class="`bg-${collorLabels[status]}-${$q.dark.isActive ? '10' : '6'}`"
        >
          <div class="text-h6" :class="$q.dark.isActive ? 'text-white' : 'text-black'">
            {{ statusLabels[status] }}
          </div>
        </q-card-section>
        <q-card-section>
          <TaskItemCard :tasks="taskStore.getTasks" :status="status" />
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useTaskStore } from 'src/stores/tasks'
import TaskItemCard from './TaskItemCard.vue'

const taskStore = useTaskStore()
const groupedTasks = computed(() => taskStore.getGroupedTasks)

const collorLabels = {
  not_started: 'indigo',
  in_progress: 'yellow',
  done: 'green',
}

const statusLabels = {
  not_started: '⏳ Не начато',
  in_progress: '🚧 В процессе',
  done: '✅ Завершено',
}

onMounted(() => {
  taskStore.setGroupedTasks(taskStore.getTasks)
})
</script>

<style lang="scss"></style>
