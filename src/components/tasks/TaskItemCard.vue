<template>
  <div>
    <draggable v-model="groupedTasks[props.status]" group="tasks" item-key="id" @end="onDragEnd">
      <template #item="{ element }">
        <q-card class="q-mb-sm" bordered>
          <q-card-section>
            <div class="text-subtitle1">{{ element.title }}</div>
            <div class="text-caption">{{ element.description }}</div>
            <div class="text-caption text-grey">📅 {{ element.dueDate }}</div>
          </q-card-section>
        </q-card>
      </template>
    </draggable>
  </div>
</template>
<script setup>
import { useTaskStore } from 'src/stores/tasks'
import { computed, watch } from 'vue'
import draggable from 'vuedraggable'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const taskStore = useTaskStore()

const props = defineProps({
  status: { type: String, required: true },
  tasks: { type: Array, required: true },
})
watch(
  () => props.tasks,
  (newVal) => {
    taskStore.setGroupedTasks(newVal)
  },
  { immediate: true },
)

const groupedTasks = computed(() => taskStore.groupedTasks)

const onDragEnd = () => {
  taskStore.setChangeTaskStatus(groupedTasks.value)

  $q.notify({ type: 'positive', message: '✅ Статус задачи обновлён!' })
}
</script>

<style lang="scss" scoped></style>
